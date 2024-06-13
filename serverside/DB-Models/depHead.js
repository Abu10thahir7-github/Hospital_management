const mongoose = require("mongoose");

const depHead = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  image: String,
  description: String,
  departmentOption: String,
});

const depHeadModel = mongoose.model("depHead", depHead);

module.exports = depHeadModel;
