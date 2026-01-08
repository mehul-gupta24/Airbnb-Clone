const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({}).populate("owner");
    // console.log(allListings);
    res.render("./listings/index.ejs", { allListings })
}

module.exports.renderNewForm = async (req, res) => {
    res.render("./listings/new.ejs")
}

module.exports.showNewListing = async (req, res) => {
    let { id } = req.params;
    const foundListing = await Listing.findById(id).populate( { path:"reviews" , populate : {path:"author"} } ).populate("owner");
    // console.log(req.params)
    if (!foundListing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing: foundListing });
}

module.exports.createNewListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body);
    console.log(req.user)
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New Listing is Created");
    res.redirect('/listings');
}

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash("error", "Listing not found");
        return res.redirect('/listings');
    }
    let imageUrl = foundListing.image.url;
    imageUrl = imageUrl.replace("/uploads","/uploads/w_250")
    res.render("./listings/edit.ejs", { listing: foundListing , imageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = await Listing.findById(id);
        newListing.image = {url,filename};
        await newListing.save();
    }

    await Listing.findByIdAndUpdate(id, req.body);

    req.flash("success", "Listing edited successfully")
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id, req.body);
    req.flash("success", "Listing deleted successfully")
    res.redirect('/listings');
}