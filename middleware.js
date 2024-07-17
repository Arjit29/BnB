function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.flash("failure","Please log in first");
        res.redirect("/login");
    }
    next();
}

module.exports = isLoggedIn;