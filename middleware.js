function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","Please log in first");
        res.redirect("/login");
    }
    next();
}

function savedUrl(req,res,next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports = { isLoggedIn, savedUrl};
