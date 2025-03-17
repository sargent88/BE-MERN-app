const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
  title: { type: String, required: true, minlength: 5 },
  description: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (val) => val.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  },
});

module.exports = mongoose.model("Place", placeSchema);
