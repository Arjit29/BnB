const express = require("express");
const router = express.Router({mergeParams: true});
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const review = require("../models/review.js");
const {isLoggedIn, isReviewAuthor} = require("../middleware.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(
        async(req,res)=>{
        let {id} = req.params;
        let {comment,rating} = req.body;
        let particular = await listing.findByIdAndUpdate(id);
        let newReview = new review({
            comment: comment,
            rating: rating,
        })
        newReview.author = req.user._id
        particular.review.push(newReview);
        await newReview.save();
        await particular.save();
        console.log(newReview);
        req.flash("success","New Review created");
        res.redirect(`/listings/${id}`);
        }
    )
)

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
