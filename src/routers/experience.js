const express = require("express");
const router = express.Router();
const Experience = require("../models/experience");
const auth = require("../middleware/auth");
// 🟢 CREATE - Add new experience
router.post("/experiences", auth, async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🟢 READ - Get all experiences
router.get("/experiences", async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 READ - Get single experience by ID
router.get("/experiences/:id", async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience)
      return res.status(404).json({ error: "Experience not found" });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 UPDATE - Update experience by ID
router.patch("/experiences/:id", async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!experience)
      return res.status(404).json({ error: "Experience not found" });
    res.json(experience);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🟢 DELETE - Delete experience by ID
router.delete("/experiences/:id", auth, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience)
      return res.status(404).json({ error: "Experience not found" });
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
