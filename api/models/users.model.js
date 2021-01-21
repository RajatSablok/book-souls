const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  email: { type: String },
  password: { type: String },

  articles: [
    {
      _id: false,
      articleId: { type: mongoose.Schema.Types.ObjectId, ref: "Article" },
    },
  ],

  books: [
    {
      _id: false,
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    },
  ],

  podcasts: [
    {
      _id: false,
      podcastId: { type: mongoose.Schema.Types.ObjectId, ref: "Podcast" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
