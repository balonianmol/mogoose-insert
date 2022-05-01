const mongoose = require("mongoose");
require("dotenv").config();
console.log(process.env.mongoUri);
main()
  .then(() => {})
  .catch((err) => console.log(err));
async function main() {
  let connection = await mongoose.connect(process.env.mongoUri);

  if (connection) {
    console.log("sucess");
  }
}

module.exports = main;
