const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const HttpError = require("./models/httpError");

const { setPlacesRoutes } = require("./routes/places");
const { setUsersRoutes } = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize routes
setPlacesRoutes(app);
setUsersRoutes(app);

// Handle 404 Errors
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Handle Errors
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res
    .status(err.code || 500)
    .json({ error: err.message || "An unknown error occurred!" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
