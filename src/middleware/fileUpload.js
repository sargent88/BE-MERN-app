const multer = require("multer");
const { v1: uuidv1 } = require("uuid");

const { MIME_TYPES } = require("../utils/constants");

const fileUpload = multer({
  limit: 5000000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPES[file.mimetype];
      cb(null, `${uuidv1()}.${ext}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPES[file.mimetype];
    let error = isValid
      ? null
      : new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
