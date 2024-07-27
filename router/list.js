const express = require("express");
const router = express.Router();
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

// router.get("/testListing",async(req,res)=>{
//     let testCase = new listing({
//         title: "Sweet Suite",
//         description: "Comfy",
//         price: 2000,
//         location: "Jaipur",
//         country: "India"
//     })

//     await testCase.save().then((res)=>{
//         console.log(res);
//     })

//     res.send("Testcase added.");
// })

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,wrapAsync(listingController.addNewListing))


router.get("/new",isLoggedIn,listingController.createNewListing)

router
.route("/:id")
.get(wrapAsync(listingController.getListing))
.put(isLoggedIn,validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,wrapAsync(listingController.destroyListing))


// router.post("/listings",async(req,res,next)=>{
//     let {title,description,image,price,location,country} = req.body;
//     let newList = new listing({
//         title: title,
//         description: description,
//         image: image,
//         price: price,
//         location: location,
//         country: country
//     })
//     try{
//         await newList.save().then((res)=>{
//             console.log(res);
//         })
//         res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
    
// })


router.get("/:id/edit",wrapAsync(listingController.editListing))

module.exports = router;
