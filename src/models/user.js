const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Place" }],
  createdAt: {
    type: Date,
    default: Date.now,
    get: (val) => val.toISOString().split("T")[0], // Format date as YYYY-MM-DD
  },
});

module.exports = mongoose.model("User", userSchema);
