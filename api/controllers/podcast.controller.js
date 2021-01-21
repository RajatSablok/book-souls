const mongoose = require("mongoose");

const Podcast = require("../models/podcasts.model");
const User = require("../models/users.model");

const createPodcast = async (req, res) => {
  const { title, description } = req.body;
  const author = req.user.userId;
  const uploadDate = Date.now();

  if (!title || !req.file) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  const podcast = new Podcast({
    _id: new mongoose.Types.ObjectId(),
    title,
    mediaURL: req.file.location,
    uploadDate,
    author,
    description,
  });

  await podcast
    .save()
    .then(async (result) => {
      await User.updateOne(
        { _id: author },
        { $push: { podcasts: { podcastId: result._id } } }
      )
        .then(() => {
          res.status(201).json({
            message: "Podcast posted successfully",
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

const getAllPodcasts = async (req, res) => {
  await Podcast.find()
    .populate("author", "name")
    .select("-__v")
    .then(async (podcasts) => {
      res.status(200).json({
        podcasts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getPodcastByID = async (req, res) => {
  const { podcastId } = req.query;

  if (!podcastId) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  await Podcast.findById(podcastId)
    .populate("author", "name")
    .select("-__v")
    .then(async (podcast) => {
      res.status(200).json({
        podcast,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid podcast ID",
        error: err.toString(),
      });
    });
};

const deletePodcast = async (req, res) => {
  const { podcastId } = req.body;
  const userId = req.user.userId;

  await Podcast.findById(podcastId)
    .then(async (podcast) => {
      if (podcast.author.equals(userId)) {
        await Podcast.deleteOne({ _id: podcastId })
          .then(async () => {
            await User.updateOne(
              { _id: userId },
              { $pull: { podcasts: { podcastId } } }
            )
              .then(() => {
                res.status(200).json({
                  message: "Podcast deleted successfully",
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: "Invalid podcast ID",
                  error: err.toString(),
                });
              });
          })
          .catch((err) => {
            res.status(404).json({
              message: "Invalid podcast ID",
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
        message: "Invalid podcast ID",
        error: err.toString(),
      });
    });
};

module.exports = {
  createPodcast,
  getAllPodcasts,
  getPodcastByID,
  deletePodcast,
};
