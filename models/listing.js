const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        // set: v=> v===""?"https://unsplash.com/photos/brown-and-black-wooden-house-TiVPTYCG_3E":v,
        default: "https://unsplash.com/photos/brown-and-black-wooden-house-TiVPTYCG_3E"
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {type: String,
        required: true
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }

    
})

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);



module.exports = Listing;

