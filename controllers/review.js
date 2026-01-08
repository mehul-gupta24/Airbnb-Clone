const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.giveReview =async(req,res,next)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","Review saved successfully")
    // console.log(listing);
    res.redirect(`/listings/${req.params.id}`)
}

module.exports.deleteReview = async (req,res)=>{
    let {id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully")
    res.redirect(`/listings/${id}`)
}