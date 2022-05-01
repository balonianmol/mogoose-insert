const mongoose =require("mongoose");
const {Schema} =mongoose;
const tokenauth = new Schema([
    {
        userid:"String",
        access_token : "String",
        expires: {
            type: Date,
            default: Date.now,
            expires: 3600
          }

    }
])
const tokenauthenicate = mongoose.model("tokendata",tokenauth);
module.exports = tokenauthenicate;