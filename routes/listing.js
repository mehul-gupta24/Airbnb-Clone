const express = require("express")
const mongoose = require("mongoose")
const router = express.Router()
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isListingOwner, validateListing } = require('../middlware');
const { populate } = require("../models/user");
const listingController = require("../controllers/listing")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})


router
.route("/")
.get(listingController.index)
.post(isLoggedIn , upload.single('image') , wrapAsync(listingController.createNewListing))

//we want to create new listing , so redirect to new.ejs html form
router.get("/new", isLoggedIn , listingController.renderNewForm)


router
.route("/:id")
.get(wrapAsync(listingController.showNewListing))
.put(isLoggedIn, isListingOwner , upload.single('image'), listingController.updateListing)
.delete(isLoggedIn, isListingOwner, listingController.deleteListing);


// edit route
router.get('/:id/edit', isLoggedIn, isListingOwner, wrapAsync(listingController.renderEdit));

module.exports = router