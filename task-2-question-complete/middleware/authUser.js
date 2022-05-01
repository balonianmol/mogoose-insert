require("dotenv").config();
const tokenAutenticator = require("../model/usertokenstroe");
const jwt = require("jsonwebtoken");
const tokenVerification = async (req, res, next) => {
  try {
    const tkn = req.headers.id;
    if (!tkn) {
      res.send(" auth token required");
    } else {
      let decode = jwt.verify(tkn, process.env.key);
      req.user = decode;
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({
      status: 500,
      message: error,
    });
  }
};
module.exports = tokenVerification;
