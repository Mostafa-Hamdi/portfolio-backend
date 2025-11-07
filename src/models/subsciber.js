const mongoose = require("mongoose");
const validator = require("validator");

const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number");
        }
      },
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
    },
  },
  { timestamps: true },
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);
module.exports = { Subscriber };
