const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");

const checkAuthorization = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new Error("Invalid token");
      }

      req.userData = decoded;
      next();
    });
  } catch (err) {
    return next(new HttpError("Authorization failed, please try again", 401));
  }
};

module.exports = checkAuthorization;
