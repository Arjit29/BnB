const express = require("express");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const review = require("./models/review.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const listingRoute = require("./router/list.js");
const reviewRoute = require("./router/rview.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const user = require("./models/user.js");
const userRoute = require("./router/user.js");


const app = express();
const port = 3000;

main().then((res)=>{
    console.log("Connected to DB.");
})
.catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/bnb");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use(session({secret: "mysupersecretcode", resave: false, saveUninitialized: true, cookie:{
    expires: Date.now() + (20*24*60*60*1000),
    maxAge: 20*24*60*60*1000,
    httpOnly: true
}}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    next();
})

// app.get("/demouser",async (req,res)=>{
//     let demoUser = new user({
//         email: "abc@gmail.com",
//         username: "Aman"
//     })
//     let demo = await user.register(demoUser,"DemoPassword");
//     res.send(demo);
// })


app.use("/listings",listingRoute);
app.use("/listings/:id/reviews",reviewRoute);
app.use("/",userRoute);


app.all("*",(req,res,next)=>{
    res.status(400).send("Page not found!");
})

app.use((err,req,res,next)=>{
    let {status=500,message= "Something went wrong"} = err;
    res.status(status).send(message);
})

// app.use((err,req,res,next)=>{
//     res.send("Something went wrong");
// })

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})