const Review = require('./models/review');
const Listing = require('./models/listing');
const ExpressError = require('./utils/ExpressError')
const { listingSchema, reviewSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "You must be logged in first!")
        return res.redirect('/login')
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//this is for listing , not review
module.exports.isListingOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (listing.owner._id.equals(res.locals.currUserStatus._id)) {
        return next();
    }
    req.flash("error","You aren't the Owner of this Listing!");
    return res.redirect(`/listings/${id}`)
}

//this is for review author for deletion of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id ,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUserStatus._id)) {
        req.flash("error","You aren't the Author of this Review!");
        return res.redirect(`/listings/${id}/reviews`)
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body)
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}