const express = require("express");

const podcastControllers = require("../controllers/podcast.controller");
const checkAuth = require("../middleware/checkAuth");
const { upload } = require("../middleware/s3UploadClient");

const router = express.Router();

//Post a podcast
router.post(
  "/create",
  checkAuth,
  upload.single("media"),
  podcastControllers.createPodcast
);

//Get all podcasts
router.get("/all", podcastControllers.getAllPodcasts);

//Get a podcast by ID
router.get("/", podcastControllers.getPodcastByID);

//Delete a podcast
router.delete("/", checkAuth, podcastControllers.deletePodcast);

module.exports = router;
