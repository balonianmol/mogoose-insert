const mongoose = require("mongoose");
const { Schema } = mongoose;
const userregistration = new Schema([
  {
    username: { type: "string", unique: true },
    password: "string",
    confpass: "string",
    email: { type: "string", unique: true },
    firstname: "string",
    lastname: "string",
    image:"string"
  },
]);
const datavalue = mongoose.model("dbData", userregistration);
module.exports = datavalue;
