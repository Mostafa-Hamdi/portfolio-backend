const mongoose = require("mongoose");
const validator = require("validator");

const projectSchema = mongoose.Schema({
  image: {
    type: String,
    required: true,
    trim: true,
  },
  imagePublicId: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  heading: {
    type: String,
    required: true,
    trim: true,
  },
  paragraph: {
    type: String,
    required: true,
    trim: true,
  },
  skills: [
    {
      type: String, // Changed from object to string
      required: true,
      trim: true,
    },
  ],
  siteLink: {
    type: String,
    required: true,
    trim: true,
    validate(val) {
      if (!validator.isURL(val)) {
        throw new Error("invalid url");
      }
    },
  },
  github: {
    type: String,
    trim: true,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
