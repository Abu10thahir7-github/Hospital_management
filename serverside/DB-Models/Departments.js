const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const department = new Schema({
  name: String,
  image: String,
  year: Number,
  description: String,
});

const depModel = mongoose.model("department", department);

module.exports = depModel;
