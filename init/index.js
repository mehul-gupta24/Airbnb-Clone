const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');
const Review = require('../models/review');

if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"
const dbURL =""

async function main(){
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
}

main().then(()=>{
    console.log("MongoDB connection established successfully");
}).catch((err)=>{
    console.log("Failed to connect to MongoDB", err);
})

//we want owner for every listing , so we create a owner from user model , as it is to be a signed user from our model


const initDB=async()=>{
    await Listing.deleteMany({});
    console.log("Cleared existing listings");
    await Review.deleteMany({});
    console.log("Cleared existing reviews");
    initData.data = await initData.data.map((obj)=>({...obj, owner : "695f92bff00f4b8d76296d1a"}))
    await Listing.insertMany(initData.data);
    console.log("Inserted sample listings");
}

initDB()