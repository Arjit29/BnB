const express = require("express");
const router = express.Router();
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing.js");
const isLoggedIn = require("../middleware.js");

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


router.get("/",
    wrapAsync(async(req,res)=>{
        let allList = await listing.find();
        // console.log(allList);
        res.render("listings/index.ejs",{allList});
    })
)

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/form.ejs");
})

router.get("/:id",
    wrapAsync(async(req,res)=>{
        let {id} = req.params;
        const item = await listing.findById(id).populate("review");
        if(!item){
            req.flash("failure","Listing does not exist");
            res.redirect("/listings");
        }
        
        res.render("listings/show.ejs",{item});
    })
)

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

router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res,next)=>{
        let {title,description,image,price,location,country} = req.body;
        let newList = new listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        })
        await newList.save().then((res)=>{
            console.log(res);
        })
        req.flash("success","New Listing added");
        res.redirect("/listings");
    })
)

router.get("/:id/edit",
    wrapAsync(async(req,res)=>{
        let {id} = req.params;
        const item = await listing.findById(id);
        res.render("listings/edit.ejs",{item});
    })
)

router.put("/:id",
    isLoggedIn,
    validateListing,
    wrapAsync(async(req,res)=>{
        let {id} = req.params;
        let {title,description,image,price,location,country} = req.body;
        await listing.findByIdAndUpdate(id,{
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        })
        req.flash("success","Listing updated");
        res.redirect(`/listings/${id}`);
    })
)

router.delete("/:id",
    isLoggedIn,
    wrapAsync(async(req,res)=>{
        let {id} = req.params;
        await listing.findByIdAndDelete(id);
        req.flash("success","Listing deleted");
        res.redirect("/listings");
    })
)

module.exports = router;
