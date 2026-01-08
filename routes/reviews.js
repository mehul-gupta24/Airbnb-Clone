const express = require("express")
const router = express.Router({mergeParams:true})
const Listing=require('../models/listing');
const Review=require('../models/review');
const wrapAsync=require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isOwner, isReviewAuthor } = require("../middlware");
const reviewController = require("../controllers/review")

//review -> post a review using post route
router.post("/"  , isLoggedIn,validateReview,wrapAsync(reviewController.giveReview))

//delete a review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor ,wrapAsync(reviewController.deleteReview))

module.exports=router