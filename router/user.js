const express = require("express");
const router = express.Router();
const passport = require("passport");
const {savedUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

router
.route("/signup")
.get(userController.getSignup)
.post(userController.signUp)

router
.route("/login")
.get(userController.getLogIn)
post(savedUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),userController.logIn);


router.get("/logout",userController.logOut);

module.exports = router;
