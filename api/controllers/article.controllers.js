const mongoose = require("mongoose");

const Article = require("../models/articles.model");

const createArticle = async (req, res) => {
  const { title, content, tags } = req.body;
  const author = req.user.userId;
  const uploadDate = Date.now();

  if (!title || !content) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  const article = new Article({
    _id: new mongoose.Types.ObjectId(),
    title,
    content,
    uploadDate,
    author,
    tags,
  });

  await article
    .save()
    .then(() => {
      res.status(201).json({
        message: "Article posted successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getAllArticles = async (req, res) => {
  await Article.find()
    .populate("author", "name")
    .select("-__v")
    .then(async (articles) => {
      res.status(200).json({
        articles,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getArticleByID = async (req, res) => {
  const { articleId } = req.query;

  if (!articleId) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  await Article.findById(articleId)
    .populate("author", "name")
    .select("-__v")
    .then(async (article) => {
      res.status(200).json({
        article,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid article ID",
        error: err.toString(),
      });
    });
};

const deleteArticle = async (req, res) => {
  const { articleId } = req.body;
  const userId = req.user.userId;

  await Article.findById(articleId)
    .then(async (article) => {
      if (article.author.equals(userId)) {
        await Article.deleteOne({ _id: articleId })
          .then(() => {
            res.status(200).json({
              message: "Article deleted successfully",
            });
          })
          .catch((err) => {
            res.status(404).json({
              message: "Invalid article ID",
              error: err.toString(),
            });
          });
      } else {
        return res.status(403).json({
          message: "",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid article ID",
        error: err.toString(),
      });
    });
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleByID,
  deleteArticle,
};
