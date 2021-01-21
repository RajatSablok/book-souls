const mongoose = require("mongoose");

const podcastSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  description: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  mediaURL: { type: String },
  uploadDate: { type: Number },
});

module.exports = mongoose.model("Podcast", podcastSchema);
