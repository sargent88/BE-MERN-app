const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const HttpError = require("./models/httpError");

const { setPlacesRoutes } = require("./routes/places");
const { setUsersRoutes } = require("./routes/users");

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
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log("File removed successfully", err);
    });
  }
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
      console.info(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
