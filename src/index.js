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

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static(path.join(__dirname, "./assets")));
const port = process.env.PORT || 3001;
app.use(express.json());

app.use(
  subscriperRouter,
  userRouter,
  projectRouter,
  landingRouter,
  serviceRouter,
  experienceRouter,
);

// errorHandler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log("Web Server Starts Up");
});
