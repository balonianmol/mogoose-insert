const mongoose = require('mongoose');
const {Schema} = mongoose;
const userAddress = new Schema([
    {
        user_id : "string",
        address: "string",
        city :"string",
        state :"string",
        phonenumber:"string",
        pincode:"string"  
    },
]);
const useraddressdata = mongoose.model("addressData",userAddress);
module.exports = useraddressdata;