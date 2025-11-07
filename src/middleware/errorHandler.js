const errorHandler = (error, req, res, next) => {
  console.error(error); // log full error for debugging

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  // Invalid ObjectId
  if (error.name === "CastError") {
    return res.status(400).send({ error: "Invalid ID Format" });
  }

  // Duplicate key error (e.g., unique email)
  if (error.code === 11000) {
    return res.status(400).send({ error: "Email already registered" });
  }

  // Default: Internal server error
  res.status(500).send({ error: "Internal Server Error" });
};

module.exports = errorHandler;
