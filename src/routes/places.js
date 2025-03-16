const express = require("express");
const { check } = require("express-validator");

const {
  createPlace,
  deletePlace,
  getPlace,
  getPlaces,
  getPlacesForUser,
  updatePlace,
} = require("../controllers/places");

function setPlacesRoutes(app) {
  const router = express.Router();

  router.get("/", getPlaces);
  router.get("/:pid", getPlace);
  router.get("/user/:uid", getPlacesForUser);

  router.post(
    "/",
    [
      check("title").notEmpty(),
      check("description").isLength({ min: 5 }),
      check("address").notEmpty(),
    ],
    createPlace
  );

  router.patch(
    "/:pid",
    [check("title").notEmpty(), check("description").isLength({ min: 5 })],
    updatePlace
  );

  router.delete("/:pid", deletePlace);

  app.use("/api/v1/places", router);
}

module.exports = { setPlacesRoutes };
