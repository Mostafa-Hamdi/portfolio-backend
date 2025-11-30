const express = require("express");
const Project = require("../models/project");
const upload = require("../utils/projectUpload.js");
const cloudinary = require("../utils/cloudinary.js");
const auth = require("../middleware/auth");
const Landing = require("../models/landingdata.js");
const router = express.Router();

// 🟢 Create new project
router.post(
  "/projects",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      // Build project data
      const projectData = {
        ...req.body,
        image: req.file ? req.file.path : null,
        imagePublicId: req.file ? req.file.filename : null,
      };

      // Validate that siteLink and github exist
      if (!projectData.siteLink) {
        return res
          .status(400)
          .json({ error: "siteLink and github are required" });
      }

      const project = new Project(projectData);
      await project.save();

      // Add project reference to Landing
      const landing = await Landing.findOne();
      if (!landing)
        return res.status(404).json({ error: "Landing data not found" });

      landing.projects.projects.push(project._id);
      await landing.save();

      res.status(201).json({
        message: "✅ Project created successfully",
        data: project,
      });
    } catch (err) {
      console.error("Error in /projects route:", err);
      next(err);
    }
  },
);

// 🟡 Read all projects
router.get("/projects", async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
});

// 🟡 Read project
router.get("/projects/:id", async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).send({ error: "project not founded" });
    }
    res.json({ data: project });
  } catch (err) {
    next(err);
  }
});

// 🟠 Update project
router.patch(
  "/projects/:id",
  auth,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      // لو في صورة جديدة مرفوعة
      if (req.file) {
        if (project.imagePublicId) {
          await cloudinary.uploader
            .destroy(project.imagePublicId)
            .catch(console.error);
        }
        project.image = req.file.path;
        project.imagePublicId = req.file.filename;
      }

      // تحديث باقي الحقول
      Object.keys(req.body).forEach((key) => {
        project[key] = req.body[key];
      });

      await project.save();

      res.send({
        message: "✅ Project updated successfully",
        data: project,
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
);

// 🟠 Delete project
router.delete("/projects/:id", auth, async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.imagePublicId) {
      await cloudinary.uploader
        .destroy(project.imagePublicId)
        .catch(console.error);
    }

    res.json({ message: "✅ Project deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
