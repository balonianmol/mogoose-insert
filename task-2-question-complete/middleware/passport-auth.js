const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const data = require("../model/user");
const session = require("express-session");
const jwt = require("jsonwebtoken")
require("dotenv").config();

passport.use(
  new LocalStrategy("local", async function (user, password, cb) {
    let userInfo = await data.findOne({ username: user });
    if (!userInfo) {
        return cb("Incorrect  username.", false);
    } else {
        let decryption = await bcrypt.compare(password, userInfo.password);
      if (decryption == false) {
        return cb("Incorrect  password.", false );
      } else {
        let token = jwt.sign({ user_id: userInfo._id }, process.env.key, {
            expiresIn: "1h",
          });
        return cb(null, token);
      }
    }
  })
);
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

module.exports = passport;
