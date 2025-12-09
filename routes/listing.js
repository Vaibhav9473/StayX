const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingsController = require('../controllers/listings.js');
const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage: storage });


router
.route('/')
.get(wrapAsync(listingsController.index))// Index route
.post(isLoggedIn,               // Create Route
   validateListing,
    upload.single('listing[image][url]'),
     wrapAsync (listingsController.createListing)
);

// new route
router.get('/new', isLoggedIn, listingsController.renderNewForm);

// search route
router.get("/search", listingsController.searchListing);





router
.route('/:id')
.get(wrapAsync(listingsController.showListing)) // show route
.put(isLoggedIn,isOwner, validateListing,      // Update route
     upload.single('listing[image][url]'),   
     wrapAsync(listingsController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingsController.deleteListing)); //delete route


// Edit route
router.get('/:id/edit', isLoggedIn,isOwner, wrapAsync(listingsController.renderEditForm));

module.exports = router;