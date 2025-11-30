const express = require("express");
const router = express.Router();
const Service = require("../models/service"); // path حسب مكان الموديل

// 🟢 CREATE - Add new service
router.post("/services", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).send(service);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 🟢 READ - Get all services
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.send(services);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 🟢 READ - Get single service by ID
router.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).send({ error: "Service not found" });
    res.send(service);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// 🟢 UPDATE - Update service by ID
router.patch("/services/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).send({ error: "Service not found" });
    res.send(service);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// 🟢 DELETE - Delete service by ID
router.delete("/services/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).send({ error: "Service not found" });
    res.send({ message: "Service deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
