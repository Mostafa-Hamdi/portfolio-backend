const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      minlength: 5,
    },
    email: {
      unique: true,
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Invalid Email Format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(val) {
        if (val.includes("password")) {
          throw new Error("Password mustn't contain (password) word");
        }
      },
    },
    avatar: {
      url: {
        type: String,
      },
      buffer: {
        type: Buffer,
      },
      type: {
        type: String,
      },
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true },
);

// Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "generatetoken");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Prevent return Tokens in response
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.tokens;
  delete userObj.password;
  return userObj;
};

// find user by email and comparing password
userSchema.statics.findByCredentials = async function (email, password, res) {
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send({ error: "Invalid email or password" });
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(404).send({ error: "Invalid email or password" });
  }
  return user;
};

// Hash passwords in database
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
// const work = async () => {
//   await User.syncIndexes();
// };
// work();

module.exports = { User };
