const mongoose = require("mongoose");
const validator = require("validator");

const landingSchema = new mongoose.Schema({
  hero: {
    badge: { type: String, required: true, trim: true },
    heading: {
      solid: { type: String, required: true, trim: true },
      colored: { type: String, required: true, trim: true },
    },
    paragraph: {
      solidOne: { type: String, required: true, trim: true },
      coloredOne: { type: String, required: true, trim: true },
      solidTwo: { type: String, required: true, trim: true },
      coloredTwo: { type: String, required: true, trim: true },
      solidThird: { type: String, required: true, trim: true },
    },
    stackOne: { heading: String, skills: [String] },
    stackTwo: { heading: String, skills: [String] },
    btnOne: String,
    btnTwo: String,
    image: String,
    publicId: String,
  },

  about: {
    badge: String,
    heading: { solid: String, colored: String },
    personalInfo: {
      name: String,
      jobTitle: String,
      location: String,
      email: {
        type: String,
        validate(val) {
          if (!validator.isEmail(val)) throw new Error("Invalid email");
        },
      },
      phone: String,
      cv: String,
    },
    statics: {
      projects: { text: String, number: String },
      experience: { text: String, number: String },
    },
    stacks: {
      frontend: { heading: String, skills: [String] },
      backend: { heading: String, skills: [String] },
      cms: { heading: String, skills: [String] },
    },
    story: { heading: String, paragraph: String },

    // Relational: Experiences
    experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  },

  // Relational: Services Section
  servicesSection: {
    badge: String,
    heading: { solid: String, colored: String },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    btn: String,
    message: String,
  },

  projects: {
    badge: String,
    heading: { solid: String, colored: String },
    paragraph: String,
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    viewBtn: String,
  },

  contact: {
    badge: String,
    heading: { solid: String, colored: String },
    paragraph: String,
    emailContent: { label: String, email: String },
    phoneContent: { label: String, phone: String },
    locationContent: { label: String, location: String },

    // Social links as array of objects
    socialLinks: [
      {
        heading: { type: String },
        links: [
          {
            label: { type: String },
            url: { type: String, trim: true },
          },
        ],
      },
    ],
  },
});

const Landing = mongoose.model("Landing", landingSchema);
module.exports = Landing;
