require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth",
  require("./routes/auth")
);

app.use("/api/mods",
  require("./routes/mods")
);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Internal server error" });
});

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  );
});