const mongoose = require("mongoose");

const ModSchema = new mongoose.Schema({
  title: String,
  gameName: String,
  version: String,
  platform: String,
  description: String,

  price: Number,

  originalFileName: String,
  hexFileName: String,

  sharemodsCode: String,
  sharemodsLink: String,

  screenshots: [String],

  authorId: String,
  authorName: String,

  downloadsCount: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Mod", ModSchema);
