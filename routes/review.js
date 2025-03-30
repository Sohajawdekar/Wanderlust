const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedin, checkAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");
router.post("/Listings/:id/review",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.createReview))

router.delete("/Listings/:id/review/:reviewId",
  isLoggedin,
  checkAuthor,
  wrapAsync(reviewController.deleteReview))

module.exports = router;