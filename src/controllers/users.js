const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/httpError");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Max Schwarz",
    email: "mschwarz@email.com",
    password: "testers",
  },
  {
    id: "u2",
    name: "Julia Smith",
    email: "juliaXsmith@email.com",
    password: "testers",
  },
];

function getUsers(req, res) {
  res.send({ users: DUMMY_USERS });
}

async function getUser(req, res, next) {
  const userId = req.params.uid;
  const user = DUMMY_USERS.find((user) => user.id === userId);

  if (!user) {
    return next(
      new HttpError("Could not find a user for the provided id.", 404)
    );
  }
  res.json({ user });
}

async function createUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  if (DUMMY_USERS.find((user) => user.email === email)) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);
  res.status(201).json({ user: createdUser });
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  res.status(201).json({ message: "Logged in!" });
}

module.exports = { createUser, getUser, getUsers, loginUser };
