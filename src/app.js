const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const HttpError = require("./models/httpError");

const placesRoutes = require("./routes/places");
const usersRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// Initialize V1 routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/places", placesRoutes);

// Handle 404 Errors
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Handle Errors
app.use((err, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) {
        console.error("Failed to remove file:", unlinkErr);
      } else {
        console.info("File removed successfully");
      }
    });
  }

  if (!req.file) {
    console.info("No file to remove");
  }

  if (res.headersSent) {
    return next(err);
  }

  // Ensure err.code is a valid HTTP status code
  const statusCode = typeof err.code === "number" ? err.code : 500;

  res.status(statusCode).json({
    error: err.message || "An unknown error occurred!",
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.info("Connected to MongoDB");
    app.listen(PORT, () => {
      console.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
