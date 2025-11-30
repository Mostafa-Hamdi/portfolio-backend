const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  bullets: [{ type: String, required: true, trim: true }],
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
