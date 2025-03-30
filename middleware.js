const Listing = require("./models/listings.js");
const Review= require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const  {reviewSchema} = require("./schema.js");
const  {ListingSchema} = require("./schema.js");

const isLoggedin= async(req, res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "Please login ");
        return res.redirect("/login");
      }else{
        next();
      }

}

const redirectUrl= async(req,res,next)=>{
  res.locals.redirectUrl= req.session.redirectUrl;
  next();
}
 
const checkOwner= async(req,res,next)=>{
  const {id}= req.params;
  const listing= await Listing.findById(id);
  if(res.locals.CurrUser && ! res.locals.CurrUser._id.equals(listing.owner._id)){
   req.flash("error", "You are not the owner of this listing");
   return res.redirect(`/Listings/${id}`)
  }
  next();
}

const checkAuthor= async(req,res,next)=>{
  const {id,reviewId}= req.params;
  const review= await Review.findById(reviewId);
  if(res.locals.CurrUser && ! res.locals.CurrUser._id.equals(review.author._id)){
   req.flash("error", "You cant delete this review");
   return res.redirect(`/Listings/${id}`)
  }
  next();
}
const validateListing = (req, res, next) => {
 
    const result = ListingSchema.validate(req.body);
    if (result.error) {
      throw new ExpressError(400, result.error);
    } else {
      next();
    }
  }

  const validateReview = (req, res, next) => {
      const result = reviewSchema.validate(req.body);
      if (result.error) {
        throw new ExpressError(400, result.error);
      } else {
        next();
      }
    }


module.exports= {isLoggedin, redirectUrl, checkOwner, checkAuthor, validateListing, validateReview};