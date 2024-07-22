const Review = require("./models/review.js")
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","Please log in first");
        return res.redirect("/login");
    }
    next();
}

module.exports.savedUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
        let {id, reviewId} = req.params;
        let review = await Review.findById(reviewId);
        if(!review.author._id.equals(res.locals.currUser._id)){
            req.flash("failure","You are not the owner of this review");
            return res.redirect(`/listings/${id}`);
        }
        next();
}
