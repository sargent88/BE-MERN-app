const express = require("express");
const { check } = require("express-validator");

const {
  createPlace,
  deletePlaceById,
  getPlaceById,
  getPlacesForUser,
  updatePlaceById,
} = require("../controllers/places");

function setPlacesRoutes(app) {
  const router = express.Router();

  router.get("/:pid", getPlaceById);
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
    updatePlaceById
  );

  router.delete("/:pid", deletePlaceById);

  app.use("/api/v1/places", router);
}

module.exports = { setPlacesRoutes };
