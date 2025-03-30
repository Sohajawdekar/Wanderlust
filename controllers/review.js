const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.createReview= async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
      const newReview = new Review(req.body);
      newReview.author= req.user._id;
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      req.flash("sucess", "New review added");
      res.redirect(`/Listings/${id}`);
  
    }
module.exports.deleteReview= async(req,res)=>{
    let {id, reviewId}= req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}});
    let listing = await Listing.findById(id).populate("reviews");
    console.log(listing)
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review deleted");
    res.redirect(`/Listings/${id}`) 
  }