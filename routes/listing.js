const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, checkOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });



router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.postNew)
  );
// .post(upload.single("image"),(req,res)=>{
//   console.log(req.file);
//   res.send(req.file);

// })

router.get("/new",
  isLoggedin,
  wrapAsync(listingController.new));

router.route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedin,
    checkOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.editListing))
  .delete(
    isLoggedin,
    checkOwner,
    wrapAsync(listingController.deleteListing));


router.get("/:id/edit",
  isLoggedin,
  wrapAsync(listingController.editForm));

module.exports = router;