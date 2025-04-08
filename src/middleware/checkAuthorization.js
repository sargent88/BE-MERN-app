const jwt = require("jsonwebtoken");
const HttpError = require("../models/httpError");

const checkAuthorization = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (err) {
    return next(new HttpError("Authorization failed, please try again", 403));
  }
};

module.exports = checkAuthorization;
