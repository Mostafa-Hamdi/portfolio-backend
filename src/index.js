const express = require("express");
require("./db/mongoose.js");
const errorHandler = require("./middleware/errorHandler.js");
const subscriperRouter = require("./routers/subscriber.js");
const userRouter = require("./routers/user.js");
const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());

app.use(subscriperRouter, userRouter);

// errorHandler middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log("Web Server Starts Up");
});
