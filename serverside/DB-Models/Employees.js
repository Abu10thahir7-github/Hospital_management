const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employee = new Schema({
  name: String,
  email: String,
  age: Number,
  image: String,
  description: String,
  departmentOption: String,
  reportTo: String,
});

const employeesModel = mongoose.model("employee", employee);

module.exports = employeesModel;
