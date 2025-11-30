const path = require("path");
const cors = require("cors");
const express = require("express");
require("./db/mongoose.js");

const errorHandler = require("./middleware/errorHandler.js");
const subscriperRouter = require("./routers/subscriber.js");
const userRouter = require("./routers/user.js");
const projectRouter = require("./routers/project.js");
const landingRouter = require("./routers/landing.js");
const serviceRouter = require("./routers/service.js");
const experienceRouter = require("./routers/experience.js");

const app = express();

// Middleware
app.use(
  cors({ origin: "https://mostafahamdidev.vercel.app", credentials: true }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "./assets")));

// Routers
app.use(
  subscriperRouter,
  userRouter,
  projectRouter,
  landingRouter,
  serviceRouter,
  experienceRouter,
);

// Error handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Web Server running on port ${port}`);
});
