const express = require("express");
const { check } = require("express-validator");

const {
  createPlace,
  deletePlaceById,
  getPlaceById,
  getPlacesForUser,
  updatePlaceById,
} = require("../controllers/places");
const fileUpload = require("../middleware/fileUpload");
const checkAuthorization = require("../middleware/checkAuthorization");

function setPlacesRoutes(app) {
  const router = express.Router();

  // UNPROTECTED ROUTES
  router.get("/:pid", getPlaceById);
  router.get("/user/:uid", getPlacesForUser);

  router.use(checkAuthorization);

  // PROTECTED ROUTES
  router.post(
    "/",
    fileUpload.single("image"),
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
