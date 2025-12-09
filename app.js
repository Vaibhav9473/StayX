if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user.js');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');




const dbUrl = process.env.ATLASDB;

main().then(() => {
    console.log("MongoDB connected");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));




// session 
const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    },
};



app.get('/', (req, res) => {
    res.redirect('/listings');
});




app.use(session(sessionOptions));
app.use(flash());





app.use( async (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
     res.locals.currentUser = await User.findById(req.session.userId);
    next();
});




app.use('/', userRouter);
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);


app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=>{
    let{statusCode = 500, message = "something went wrong"} = err;
    res.render("./listings/error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log(`Server is running on port http://localhost:${8080} 8080`);
});