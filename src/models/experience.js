const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true, trim: true },
  jobType: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  workPeriod: { type: String, required: true, trim: true },
});

const Experience = mongoose.model("Experience", experienceSchema);
module.exports = Experience;
