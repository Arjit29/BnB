const User = require("../models/user.js");

module.exports.getSignup = (req, res) => {
    res.render("user/userSignup.ejs");
}


module.exports.signUp = async (req, res) => {
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

module.exports.getLogIn = (req,res)=>{
    res.render("user/userLogin.ejs");
}

module.exports.logIn = async(req,res)=>{
    req.flash("success","Welcome back to BnB");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logOut = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged out successfully");
        res.redirect("/listings");
    })
}