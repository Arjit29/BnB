const listing = require("../models/listing.js");
const review = require("../models/review.js");

module.exports.createNewReview = async(req,res)=>{
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

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}