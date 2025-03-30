const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken= process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken:mapToken});



module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

module.exports.new = async (req, res) => {
  res.render("listings/new.ejs");
}


module.exports.show = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id).
    populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing doesn't exist")
    res.redirect("/Listings")
  }
  res.render("listings/show.ejs", { listing });
}


module.exports.postNew = async (req, res, next) => {
  let response= await geocodingClient.forwardGeocode({
    query: req.body.location,
    limit: 1
  })
    .send()

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();
  req.flash("sucess", "New listing added");
  res.redirect("/Listings");

}

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing)
  res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const updatedListing = req.body;
  const listing = await Listing.findByIdAndUpdate(id, updatedListing);
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  res.redirect("/Listings");
}

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("sucess", "Deleted Listing");
  res.redirect("/Listings");
}