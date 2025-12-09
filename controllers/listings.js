const Listing = require("../models/listing");



module.exports.index = async (req, res) => {
   const allListings =  await Listing.find({});
   res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res)=>{
    res.render('./listings/new.ejs');
};

module.exports.showListing = async (req, res)=>{
       let {id} = req.params;
      const listing = await Listing.findById(id)
      .populate({ 
        path:"reviews",
        populate: {
           path:"author",

        },
      })
      .populate("owner");
      if(!listing){
        req.flash('error', 'Does not exist!');
        return res.redirect('/listings');
      }
     
      res.render('./listings/show.ejs', {listing});
};

module.exports.createListing = async (req, res, next)=>{
   let filename = req.file.filename;
    let url = req.file.path;
   req.body.listing.image = {url, filename};
  const newListing = new Listing(req.body.listing);
   newListing.owner = req.session.userId;
   newListing.image = {url, filename};
    await newListing.save();
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
    
};

module.exports.renderEditForm = async (req, res)=> {
     let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Does not exist!');
        return res.redirect('/listings');
      }
      let originalImageUrl = listing.image.url;
       originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_300");
    res.render('./listings/edit.ejs', {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
     if(!req.body.listing){
    throw new ExpressError(400, "send valid data");
  }
         let {id} = req.params;
           let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

           if( typeof req.file !== "undefined"){
              let filename = req.file.filename;
              let url = req.file.path;
              listing.image = {url, filename};
              await listing.save();
           }
          req.flash('success', 'Successfully updated the listing!');

         res. redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res)=>{
       let {id} = req.params;
       let deletedListing = await Listing.findByIdAndDelete(id);
       req.flash('success', 'Successfully deleted the listing!');

       res.redirect("/listings");
};

module.exports.searchListing = async (req, res) => {
    const query = req.query.location || "";

    const listings = await Listing.find({
        location: { $regex: query, $options: "i" }
    });

    res.render("listings/index.ejs", { allListings: listings, query });
};