const { Router } = require("express");
const fs = require("fs");
const Landing = require("../models/landingdata");
const Project = require("../models/project");
const Experience = require("../models/experience");
const Service = require("../models/service");
const upload = require("../utils/projectUpload");
const cloudinary = require("../utils/cloudinary");
const auth = require("../middleware/auth");

const router = new Router();

// 🟢 Create Landing
router.post(
  "/landing",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      // Prevent multiple landing pages
      const existingLanding = await Landing.findOne();
      if (existingLanding) {
        return res.status(400).json({ error: "Landing page already exists" });
      }

      // Fetch IDs for references
      const projectIds = (await Project.find({}, "_id")).map((p) => p._id);
      const serviceIds = (await Service.find({}, "_id")).map((s) => s._id);
      const experienceIds = (await Experience.find({}, "_id")).map(
        (e) => e._id,
      );

      // Merge req.body with explicit references
      const landingData = {
        ...req.body,
        projects: {
          ...req.body.projects,
          projects: projectIds,
        },
        servicesSection: {
          ...req.body.servicesSection,
          services: serviceIds,
        },
        about: {
          ...req.body.about,
          experiences: experienceIds,
        },
      };

      // Create landing
      const landing = new Landing(landingData);

      // Upload hero image if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        landing.hero.image = result.secure_url;
        landing.hero.publicId = result.public_id;
        fs.unlink(req.file.path, () => {}); // remove temp file
      }

      await landing.save();

      // Populate all references
      await landing.populate([
        "projects.projects",
        "servicesSection.services",
        "about.experiences",
      ]);

      res.status(201).json({
        message: "Landing data added successfully",
        data: landing,
      });
    } catch (err) {
      next(err);
    }
  },
);

// 🟢 Get Landing
router.get("/landing", async (req, res, next) => {
  try {
    const landing = await Landing.findOne().populate([
      "projects.projects",
      "servicesSection.services",
      "about.experiences",
    ]);

    if (!landing) {
      return res.status(404).json({ error: "Landing page not found" });
    }

    res.json({ data: landing });
  } catch (err) {
    next(err);
  }
});

// 🟢 Update Hero Section
router.patch(
  "/landing/hero",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const landing = await Landing.findOne();
      if (!landing) {
        return res.status(404).json({ error: "Landing not found" });
      }

      // Upload new image if provided
      if (req.file) {
        if (landing.hero.publicId) {
          await cloudinary.uploader.destroy(landing.hero.publicId);
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        landing.hero.image = result.secure_url;
        landing.hero.publicId = result.public_id;
        fs.unlink(req.file.path, () => {});
      }

      // Whitelist allowed hero fields
      const allowedFields = [
        "badge",
        "heading",
        "paragraph",
        "stackOne",
        "stackTwo",
        "btnOne",
        "btnTwo",
      ];
      allowedFields.forEach((key) => {
        if (req.body[key] !== undefined) {
          landing.hero[key] = req.body[key];
        }
      });

      await landing.save();

      res.json({
        message: "Hero section updated successfully",
        data: landing,
      });
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
