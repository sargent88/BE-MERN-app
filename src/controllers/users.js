const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

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

  const createdUser = new User({
    name,
    email,
    password,
    image: `https://placehold.co/150X150?text=${name.split(" ").join("+")}`,
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
  let isExistingUser;

  try {
    isExistingUser = await User.findOne({ email, password });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!isExistingUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  res
    .status(201)
    .json({
      message: "Logged in!",
      user: isExistingUser.toObject({ getters: true }),
    });
}

module.exports = { createUser, getUser, getUsers, loginUser };
