const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const ROLE_TYPES = ["admin", "user", "read_only"];

const roleSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    enum: ROLE_TYPES,
  },
  description: { type: String, required: true },
});

roleSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Role", roleSchema);
