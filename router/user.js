const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {savedUrl} = require("../middleware.js");

// GET route for signup page
router.get("/signup", (req, res) => {
    res.render("user/userSignup.ejs");
});

// POST route for handling signup
router.post("/signup", 
    async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const newUser = new User({ email,username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.logIn(registeredUser,(err)=>{
                if(err){
                    return next(err);
                }
                req.flash("success", "User registered successfully");
                res.redirect("/listings");
            })
           
        } catch (e) {
            req.flash("failure", e.message);
            res.redirect("/signup");
        }
    }
);

router.get("/login",(req,res)=>{
    res.render("user/userLogin.ejs");
})

router.post("/login",
    savedUrl,
    passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}),
    async(req,res)=>{
    req.flash("success","Welcome back to BnB");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
})

module.exports = router;
