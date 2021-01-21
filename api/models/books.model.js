const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  uploadDate: { type: Number },
  tags: [],
});

module.exports = mongoose.model("Book", bookSchema);
