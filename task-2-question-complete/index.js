const express = require("express");
const netcall = require("./controller/network");
const session = require("express-session");
const passport= require("passport")
const multer = require("multer");
const app = express();
app.use(express.json());
app.use(session({ secret: 'super secret' }));
const strategy = require('./middleware/passport-auth')
app.use(passport.initialize());
app.use(passport.session());
const { application } = require("express");
const router = require("./routes/routeuser");
app.use("/", router) 
  app.listen(3000, () => {
    console.log("server started at 3000");
  });
