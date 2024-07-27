const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {savedUrl} = require("../middleware.js");
const userController = require("../controllers/user.js");

// GET route for signup page
router.get("/signup", userController.getSignup);

// POST route for handling signup
router.post("/signup", userController.signUp);

router.get("/login",userController.getLogIn);

router.post("/login",savedUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),userController.logIn);

router.get("/logout",userController.logOut);

module.exports = router;
