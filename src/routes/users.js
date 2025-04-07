const express = require("express");
const { check } = require("express-validator");

const {
  createUser,
  getUser,
  getUsers,
  loginUser,
} = require("../controllers/users");
const fileUpload = require("../middleware/fileUpload");

const router = express.Router();

router.get("/", getUsers);
router.get("/:uid", getUser);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  createUser
);
router.post("/login", loginUser);

module.exports = router;
