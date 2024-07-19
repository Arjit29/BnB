const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

main().then((res)=>{
    console.log("Connected to DB.");
})
.catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/bnb");
}

const initDB = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner: '6697e6524c29ea9afdc6b374'}));
    await listing.insertMany(initData.data);
}

initDB();