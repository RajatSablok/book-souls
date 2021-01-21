const mongoose = require("mongoose");

const Book = require("../models/books.model");
const User = require("../models/users.model");

const createBook = async (req, res) => {
  const { title, content, tags } = req.body;
  const author = req.user.userId;
  const uploadDate = Date.now();

  if (!title || !content) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    title,
    content,
    uploadDate,
    author,
    tags,
  });

  await book
    .save()
    .then(async (result) => {
      await User.updateOne(
        { _id: author },
        { $push: { books: { bookId: result._id } } }
      )
        .then(() => {
          res.status(201).json({
            message: "Book posted successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong",
            error: err.toString(),
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getAllBooks = async (req, res) => {
  await Book.find()
    .populate("author", "name")
    .select("-__v")
    .then(async (books) => {
      res.status(200).json({
        books,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getBookByID = async (req, res) => {
  const { bookId } = req.query;

  if (!bookId) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  await Book.findById(bookId)
    .populate("author", "name")
    .select("-__v")
    .then(async (book) => {
      res.status(200).json({
        book,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid book ID",
        error: err.toString(),
      });
    });
};

const deleteBook = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  await Book.findById(bookId)
    .then(async (book) => {
      if (book.author.equals(userId)) {
        await Book.deleteOne({ _id: bookId })
          .then(async () => {
            await User.updateOne(
              { _id: userId },
              { $pull: { books: { bookId } } }
            )
              .then(() => {
                res.status(200).json({
                  message: "Book deleted successfully",
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: "Invalid book ID",
                  error: err.toString(),
                });
              });
          })
          .catch((err) => {
            res.status(404).json({
              message: "Invalid book ID",
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
        message: "Invalid book ID",
        error: err.toString(),
      });
    });
};

module.exports = {
  createBook,
  getAllBooks,
  getBookByID,
  deleteBook,
};
