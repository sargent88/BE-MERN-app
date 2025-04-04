const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const HttpError = require("../models/httpError");
const User = require("../models/user");

async function getUsers(req, res) {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }

  res.send({ users: users.map((user) => user.toObject({ getters: true })) });
}

async function getUser(req, res, next) {
  const userId = req.params.uid;
  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a user.", 500)
    );
  }

  if (!user) {
    return next(
      new HttpError("Could not find a user for the provided id.", 404)
    );
  }

  res.json({ user: user.toObject({ getters: true }) });
}

async function createUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;
  let isExistingUser;

  try {
    isExistingUser = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (isExistingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again.", 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    // image: `https://placehold.co/150X150?text=${name.split(" ").join("+")}`, // placeholder image
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  let existingUser;
  let isValidPassword = false;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError("Could not log you in, please check your credentials.", 500)
    );
  }

  if (!existingUser && !isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!token) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token,
  });
}

module.exports = { createUser, getUser, getUsers, loginUser };
