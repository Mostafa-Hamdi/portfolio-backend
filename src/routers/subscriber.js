const express = require("express");
const { Subscriber } = require("../models/subsciber");
const auth = require("../middleware/auth");

const router = new express.Router();

// Create Subscriber
router.post("/subscribers", async (req, res, next) => {
  const subscriber = new Subscriber(req.body);
  try {
    await subscriber.save();
    res.status(201).send({ message: "Thanks For Subscribtion" });
  } catch (err) {
    next(err);
  }
});

// Read Subscribers
router.get("/subscribers", auth, async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find({});
    res.send({ data: subscribers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
