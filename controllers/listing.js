const listing = require("../models/listing.js");

module.exports.index = async(req,res)=>{
    let allList = await listing.find();
    // console.log(allList);
    res.render("listings/index.ejs",{allList});
}

module.exports.createNewListing = (req,res)=>{
    res.render("listings/form.ejs");
}

module.exports.getListing = async(req,res)=>{
    let {id} = req.params;
    const item = await listing.findById(id).populate({path: "review",populate:{path: "author"} }).populate("owner");
    if(!item){
        req.flash("failure","Listing does not exist");
        res.redirect("/listings");
    }
    
    res.render("listings/show.ejs",{item});
}

module.exports.addNewListing = async(req,res,next)=>{
    let {title,description,image,price,location,country} = req.body;
    let newList = new listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    })
    newList.owner = req.user._id;
    await newList.save().then((res)=>{
        console.log(res);
    })
    req.flash("success","New Listing added");
    res.redirect("/listings");
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    const item = await listing.findById(id);
    res.render("listings/edit.ejs",{item});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let {title,description,image,price,location,country} = req.body;
    let partList = await listing.findById(id);
    if(!partList.owner._id.equals(res.locals.currUser._id)){
        req.flash("failure","You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
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
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let partList = await listing.findById(id);
    if(!partList.owner._id.equals(res.locals.currUser._id)){
        req.flash("failure","You are not the owner");
        return res.redirect(`/listings/${id}`);
    }
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}