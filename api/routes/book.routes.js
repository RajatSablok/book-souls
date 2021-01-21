const express = require("express");

const bookControllers = require("../controllers/book.controllers");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

//Post an book
router.post("/create", checkAuth, bookControllers.createBook);

//Get all books
router.get("/all", bookControllers.getAllBooks);

//Get an book by ID
router.get("/", bookControllers.getBookByID);

//Delete an book
router.delete("/", checkAuth, bookControllers.deleteBook);

module.exports = router;
