const db= require("../model/index");
const crypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer =require("../middleware/multer")
require("dotenv").config();
const userAddress = require("../model/useradress");
const userTokengenrator = require("../model/usertokenstroe");
const cloudinary = require('cloudinary').v2;
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const register = async (req, res) => {
  try {
    if (req.body.password !== req.body.confpass) {
      console.error;
    }
    let saltRounds = await crypt.genSalt(10);
    let encrypt = await crypt.hashSync(req.body.password, saltRounds);
    let registration = await db.userregister.create({
      username: req.body.username,
      password: encrypt,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    let token = jwt.sign({ registration: registration._id }, process.env.key, {
      expiresIn: "1h",
    });
    console.log("sucessfully created data");
    const msg = {
      to: 'abaloni02@gmail.com', 
      from: 'anmol@excellencetechnologies.in', 
      subject: 'registration sucessfull',
      text: 'thanks for registering thank you',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
   await sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
    res.send(token);
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const logIn = async (req, res) => {
  try {
    let user = await db.userregister.findOne({ username: req.body.username });
    if (user) {
      let decryption = await crypt.compare(req.body.password, user.password);
      if (decryption == true) {
        let token = jwt.sign({ user_id: user._id }, process.env.key, {
          expiresIn: "1h",
        });
        res.send(token);
      }
    } else {
      res.send("Invalid Password");
    }
  } catch (error) {
    console.error(error);
    res.json({
      status: 500,
      message: error.message,
    });
  }
};
const giveuserData = async (req, res) => {
  try {
    let decoded = req.user;
    console.log(decoded);
    let foundData = await db.userregister.findById({ _id: decoded.registration });
    if (foundData) {
      res.send(foundData);
    } else {
      res.send(404);
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};
const deluserData = async (req, res) => {
  try {
    let decoded = req.user;
    let founduser = await db.userregister.findOne({ _id: decoded.registration });
    if (founduser) {
      await data.deleteOne({ _id: decoded.registration });
      res.send("data deleted");
    } else {
      console.log("data does not exist");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};
const paginateddataReturn = async (req, res) => {
  try {
    const { page = req.params.id, limit = 10 } = req.params;
    if (page<1){page=1}
    const posts = await db.userregister
      .find()
      .limit(limit )
      .skip((page - 1) * limit);

    const count = await db.userregister.countDocuments();
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err.message);
  }
};
const addressCreate = async (req, res) => {
  try {
    let uid = req.user;

    let createdadta = await db.useraddressdataupdate.create({
      user_id: uid.user_id,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      phonenumber: req.body.phonenumber,
      pincode: req.body.pincode,
    });

    res.send(createdadta);
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const deleteAddress = async (req, res) => {
  try {
    let uid = req.user;
    let findaddressdata = await db.useraddressdataupdate.findOne({
      user_id: uid.registration,
    });
    if (!findaddressdata) {
      res.send("invalid address");
    } else {
      await db.useraddressdataupdate.deleteOne({ address: findaddressdata.address });
      res.send("address deleted");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const passwordResetgenrator = async (req, res) => {
  try {
    let userdata = await db.userregister.findOne({ email: req.body.email });
    if (!userdata) {
      res.send("please enter valid email");
    } else {
      let token = jwt.sign({ registration: userdata._id }, process.env.key, {
        expiresIn: "1800s",
      });const msg = {
        to: 'abaloni02@gmail.com', 
        from: 'anmol@excellencetechnologies.in', 
        subject: 'password reset',
        text: 'you requested to reset the password',
        html: `<link>http://localhost:3000/user/verify_reset_password/${token}</link>`,
      }
     await sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
      await db.userTokendataUpdate.create({
        userid : userdata._id,
        access_token :token
      })


      res.send("email sent");
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const passwordReset = async (req, res) => {
  try {
    let passreset = req.user;
    let usercheckauthtoken = await db.userTokendataUpdate.findOne({userid:passreset.registration})
    if(usercheckauthtoken){
    let saltRounds = await crypt.genSalt(10);
    let passwordNew = await crypt.hashSync(req.body.password, saltRounds);
     await data.updateOne({ _id: passreset.registration}, { password: passwordNew });
     const msg = {
      to: 'abaloni02@gmail.com', 
      from: 'anmol@excellencetechnologies.in', 
      subject: 'password reset sucessfully',
      text: 'you sucessfully reseted the passowrd',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
   await sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
     await db.userTokendataUpdate.deleteOne({_id:usercheckauthtoken._id})}
     else{res.send("token expired")}
  } catch (error) {
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
};
const uploadimagedata= async(req,res) =>{
  try{
  let decode = req.user
  console.log(decode)
  cloudinary.config({
    cloud_name:process.env.cloudinary_cloud_name  ,
    api_key: process.env.cloudinary_cloud_api_key,
    api_secret: process.env.cloudinary_cloud_api_secret 
  }); 
  let result = await cloudinary.uploader.upload(req.file.path)
  await db.userregister.updateOne({_id:decode.registration},{image:result.secure_url})
  
  
   }
  catch(error){
    console.log(error);
    res.json({
      status: 0,
      message: error,
    });
  }
}
module.exports = {
  register,
  logIn,
  giveuserData,
  deluserData,
  addressCreate,
  paginateddataReturn,
  deleteAddress,
  passwordResetgenrator,
  passwordReset,
  uploadimagedata,
};
