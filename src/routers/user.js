const { Router } = require("express");
const { User } = require("../models/user");
const multer = require("multer");
const auth = require("../middleware/auth");
const router = new Router();

// ********************   API Routes For User    *****************************

// Create User
router.post("/register", async (req, res, next) => {
  const user = new User(req.body);
  try {
    const token = await user.generateAuthToken();
    res.status(201).send({
      message: "User Created Successfully",
      user: user,
      token,
    });
  } catch (Err) {
    next(Err);
  }
});

// Login API Route
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password,
      res,
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (Err) {
    next(Err);
  }
});

// Read me
router.get("/me", auth, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (err) {
    next(err);
  }
});

// Update me change password or username
router.patch("/me/update", auth, async (req, res, next) => {
  try {
    const allowedUpdates = ["username", "password"];
    const updates = Object.keys(req.body);
    const isValidUpdates = updates.every((update) =>
      allowedUpdates.includes(update),
    );
    console.log(updates);
    console.log(isValidUpdates);
    if (!isValidUpdates) {
      return res.status(400).send({
        error: "Invalid Updates. only can update username and password",
      });
    }
    updates.forEach((update) => {
      return (req.user[update] = req.body[update]);
    });
    await req.user.save();
    res.send({ message: "User Updated Successfully", data: req.user });
  } catch (Err) {
    next(Err);
  }
});

// logout
router.post("/logout", auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token,
    );
    await req.user.save();
    res.send({ message: "logged out successfully" });
  } catch (Err) {
    next(Err);
  }
});

const upload = multer({
  limits: {
    fileSize: 1_000_000, // 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/i)) {
      return cb(new Error("Invalid file type. Only PNG or JPG allowed."));
    }
    cb(null, true);
  },
});

// create image routes
router.post(
  "/profile/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    console.log(req.file);
    res.send("ss");
  },
);

module.exports = router;
