const { User, Thought } = require("../models");

const thoughtController = {
  // /api/thoughts route
  //get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        res.status(400).json(err);
      })
  },

  //get single thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res
            .status(404)
            .json({ message: "Thought with that ID does not exist" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  //create new thought
  createThought({ body }, res) {
    Thought.create(body)
      .then((dbThoughtData) => {
        User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        )
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: "No user found with this id" });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            res.json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  //update thought by id
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.id }, body, { new: true })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(400).json({ message: "Thought ID does not exist" });
          return;
        }
        res.json(dbThoughtData);
      }).catch((err) => {
        res.status(400).json(err);
      });
  },
  // delete thought by id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(400).json({ message: "Thought ID does not exist" });
          return;
        }
        User.findOneAndUpdate(
          { username: dbThoughtData.username },
          { $pull: { thoughts: params.id } }
        )
          .then(() => {
            res.json({ message: "Thought has been deleted" });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  // add new thought reaction
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true }
    )
      .then((dbThoughData) => {
        if (!dbThoughData) {
          res.status(400).json({ message: "Thought ID does not exist" });
          return;
        }
        res.json(dbThoughData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
  //delete reactions reactionid value
  deleteReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThoughData) => {
        if (!dbThoughData) {
          res.status(400).json({ message: "Thought ID does not exist" });
          return;
        }
        res.json(dbThoughData);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  },
};

module.exports = thoughtController;
