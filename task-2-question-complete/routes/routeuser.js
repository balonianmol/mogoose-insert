const router = require("express").Router();
const userControl = require("../controller/userController");
const passport = require("passport");
const auth = require("../middleware/authUser");
const multer =require("../middleware/multer")
router.post("/register", userControl.register);
router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/user/success" }),
  (error, req, res, next) => {
    try {
      if (error) {
        throw new Error(error);
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);
//  userControl.logIn);
router.get("/user/success", (req, res) => {
  res.send(req.user);
});
router.get("/user/failed", (req, res) => {
  res.send("authentication failed");
});
router.get("/user/get/", auth, userControl.giveuserData);
router.put("/userdelete/", auth, userControl.deluserData);
router.get("/list/", auth, userControl.paginateddataReturn);
router.post("/user/address", auth, userControl.addressCreate);
router.delete("/user/address/delete", auth, userControl.deleteAddress);
router.post("/user/forgot_password", userControl.passwordResetgenrator);
router.post("/user/verify_reset_password/", auth, userControl.passwordReset);
router.post("/user/uploadImage",auth,multer.single('image'),userControl.uploadimagedata)
module.exports = router;
