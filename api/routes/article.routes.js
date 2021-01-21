const express = require("express");

const articleControllers = require("../controllers/article.controllers");
const checkAuth = require("../middleware/checkAuth");

const router = express.Router();

//Post an article
router.post("/create", checkAuth, articleControllers.createArticle);

//Get all articles
router.get("/all", articleControllers.getAllArticles);

//Get an article by ID
router.get("/", articleControllers.getArticleByID);

//Delete an article
router.delete("/", checkAuth, articleControllers.deleteArticle);

module.exports = router;
