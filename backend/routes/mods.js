const router = require("express").Router();
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const axios = require("axios");
const auth = require("../middleware/auth");
const Mod = require("../models/Mod");
const User = require("../models/User");

const parse = multer({
  limits: { fieldSize: 100 * 1024 * 1024 }
}).none();
const SHAREMODS_KEY = process.env.SHAREMODS_API_KEY;
const SM_BASE = "https://sharemods.com/api";

async function ensureFolder(key, folderName) {
  const list = await axios.get(`${SM_BASE}/folder/list`, {
    params: { key, fld_id: 0 }
  });
  const folders = list.data?.result?.folders || [];
  const existing = folders.find(
    (f) => f.name.toLowerCase() === folderName.toLowerCase()
  );
  if (existing) return existing.fld_id;

  const created = await axios.get(`${SM_BASE}/folder/create`, {
    params: { key, name: folderName, parent_id: 0 }
  });
  return created.data?.result?.fld_id;
}

router.post("/upload", auth, parse, async (req, res) => {
  try {
    const {
      title, gameName, version, platform,
      price, description, modFile, originalFileName,
      screenshot1, screenshot2, screenshot3
    } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const ext = path.extname(originalFileName || "mod.zip") || ".zip";
    const hexName = crypto.randomBytes(16).toString("hex") + ext;

    let sharemodsCode = "";
    let sharemodsLink = "";
    let fileSize = "Unknown";

    if (modFile && SHAREMODS_KEY) {
      const match = modFile.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const buf = Buffer.from(match[2], "base64");
        const origName = originalFileName || `mod${ext}`;

        fileSize = `${(buf.length / 1024 / 1024).toFixed(2)} MB`;

        // Step 1 — get upload server
        const serverRes = await axios.get(`${SM_BASE}/upload/server`, {
          params: { key: SHAREMODS_KEY }
        });
        const uploadUrl = serverRes.data.result;
        const sessId = serverRes.data.sess_id;

        // Step 2 — upload file
        const uploadForm = new FormData();
        uploadForm.append("sess_id", sessId);
        uploadForm.append("utype", "reg");
        uploadForm.append("file_0", buf, {
          filename: origName,
          contentType: mime
        });

        const uploadRes = await axios.post(uploadUrl, uploadForm, {
          headers: uploadForm.getHeaders()
        });
        const uploadData = uploadRes.data;
        const fileCode = Array.isArray(uploadData)
          ? uploadData[0]?.file_code
          : null;

        if (!fileCode) {
          return res.status(500).json({ message: "ShareMods upload failed" });
        }

        sharemodsCode = fileCode;

        // Step 3 — rename file to hex name
        await axios.get(`${SM_BASE}/file/rename`, {
          params: {
            key: SHAREMODS_KEY,
            file_code: fileCode,
            name: hexName
          }
        });

        // Step 4 — ensure user folder exists
        const folderId = await ensureFolder(SHAREMODS_KEY, user.username);

        // Step 5 — move file to user folder
        if (folderId) {
          await axios.get(`${SM_BASE}/file/set_folder`, {
            params: {
              key: SHAREMODS_KEY,
              file_code: fileCode,
              fld_id: folderId
            }
          });
        }

        sharemodsLink = `https://sharemods.com/${fileCode}`;
      }
    }

    // save screenshots locally
    const ssDir = path.join(__dirname, "..", "uploads", "screenshots");
    if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

    const saveSs = (dataUrl, idx) => {
      if (!dataUrl) return "";
      const m = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!m) return dataUrl;
      const ext2 = m[1].split("/").pop() || "png";
      const fileName = `${crypto.randomBytes(8).toString("hex")}_ss${idx}.${ext2}`;
      fs.writeFileSync(
        path.join(ssDir, fileName),
        Buffer.from(m[2], "base64")
      );
      return `/uploads/screenshots/${fileName}`;
    };

    const screenshots = [
      saveSs(screenshot1, 1),
      saveSs(screenshot2, 2),
      saveSs(screenshot3, 3)
    ].filter(Boolean);

    const mod = await Mod.create({
      title,
      gameName,
      version,
      platform,
      price: parseFloat(price) || 0,
      description,
      originalFileName: originalFileName || `mod${ext}`,
      hexFileName: hexName,
      sharemodsCode,
      sharemodsLink,
      fileSize,
      screenshots,
      authorId: req.userId,
      authorName: user.username,
      downloadsCount: 0
    });

    res.json({ success: true, mod });
  } catch (err) {
    console.error("Upload error:", err?.response?.data || err.message);
    res.status(500).json({
      message: err?.response?.data?.msg || err.message || "Upload failed"
    });
  }
});

router.put("/:id", auth, parse, async (req, res) => {
  try {
    const existing = await Mod.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Mod not found" });

    const {
      title, gameName, version, platform,
      price, description, modFile, originalFileName,
      screenshot1, screenshot2, screenshot3
    } = req.body;

    const updateData = {
      title, gameName, version, platform,
      price: parseFloat(price) || 0,
      description
    };

    // preserve existing ShareMods data unless a new file is uploaded
    if (modFile) {
      const match = modFile.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const buf = Buffer.from(match[2], "base64");
        const ext = path.extname(originalFileName || "mod.zip") || ".zip";
        const hexName = crypto.randomBytes(16).toString("hex") + ext;

        updateData.fileSize = `${(buf.length / 1024 / 1024).toFixed(2)} MB`;
        updateData.originalFileName = originalFileName || `mod${ext}`;
        updateData.hexFileName = hexName;

        if (SHAREMODS_KEY) {
          try {
            const serverRes = await axios.get(`${SM_BASE}/upload/server`, {
              params: { key: SHAREMODS_KEY }
            });
            const uploadUrl = serverRes.data.result;
            const sessId = serverRes.data.sess_id;

            const uploadForm = new FormData();
            uploadForm.append("sess_id", sessId);
            uploadForm.append("utype", "reg");
            uploadForm.append("file_0", buf, {
              filename: originalFileName || `mod${ext}`,
              contentType: mime
            });

            const uploadRes = await axios.post(uploadUrl, uploadForm, {
              headers: uploadForm.getHeaders()
            });
            const uploadData = uploadRes.data;
            const fileCode = Array.isArray(uploadData) ? uploadData[0]?.file_code : null;

            if (fileCode) {
              await axios.get(`${SM_BASE}/file/rename`, {
                params: { key: SHAREMODS_KEY, file_code: fileCode, name: hexName }
              });
              const folderId = await ensureFolder(SHAREMODS_KEY, existing.authorName);
              if (folderId) {
                await axios.get(`${SM_BASE}/file/set_folder`, {
                  params: { key: SHAREMODS_KEY, file_code: fileCode, fld_id: folderId }
                });
              }
              updateData.sharemodsCode = fileCode;
              updateData.sharemodsLink = `https://sharemods.com/${fileCode}`;
            }
          } catch {
            // ShareMods failed — keep existing data
          }
        }
      }
    } else {
      // no new file — keep existing values
      updateData.sharemodsCode = existing.sharemodsCode;
      updateData.sharemodsLink = existing.sharemodsLink;
      updateData.fileSize = existing.fileSize;
      updateData.hexFileName = existing.hexFileName;
      updateData.originalFileName = existing.originalFileName;
    }

    // update screenshots if new ones are provided
    const ssDir = path.join(__dirname, "..", "uploads", "screenshots");
    if (!fs.existsSync(ssDir)) fs.mkdirSync(ssDir, { recursive: true });

    const saveSs = (dataUrl, idx) => {
      if (!dataUrl || dataUrl.startsWith("/uploads/")) return dataUrl || "";
      const m = dataUrl.match(/^data:(.+);base64,(.+)$/);
      if (!m) return dataUrl || "";
      const ext2 = m[1].split("/").pop() || "png";
      const fileName = `${crypto.randomBytes(8).toString("hex")}_ss${idx}.${ext2}`;
      fs.writeFileSync(path.join(ssDir, fileName), Buffer.from(m[2], "base64"));
      return `/uploads/screenshots/${fileName}`;
    };

    updateData.screenshots = [
      saveSs(screenshot1, 1),
      saveSs(screenshot2, 2),
      saveSs(screenshot3, 3)
    ].filter(Boolean);

    const mod = await Mod.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, mod });
  } catch (err) {
    console.error("Update error:", err?.response?.data || err.message);
    res.status(500).json({
      message: err?.response?.data?.msg || err.message || "Update failed"
    });
  }
});

router.post("/:id/download", async (req, res) => {
  try {
    const mod = await Mod.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadsCount: 1 } },
      { new: true }
    );
    if (!mod) return res.status(404).json({ message: "Mod not found" });
    res.json({ success: true, downloadsCount: mod.downloadsCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const mods = await Mod.find().sort({ createdAt: -1 });
    res.json(mods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
