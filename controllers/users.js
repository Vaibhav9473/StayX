const User = require('../models/user.js');
const bcrypt = require("bcrypt");



module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signupForm = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash("error", "Username already exists");
            return res.redirect("/signup");
        }

        const user = new User({ email, username, password });
        await user.save(); // password hashing model me ho jayega

        

        req.flash("success", "Registered successfully!");
        res.redirect('/login');

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};


module.exports.renderLoginForm =  (req, res) => {
    res.render('users/login.ejs');
};

module.exports.loginForm =  async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        req.flash("error", "Invalid username");
        return res.redirect("/login");
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        req.flash("error", "Incorrect password");
        return res.redirect("/login");
    }

    // Save user session
    req.session.userId = user._id;

    req.flash("success", "Welcome back StayX!");
      const redirectUrl = req.session.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    res.redirect(redirectUrl);

};

module.exports.logout =  (req, res) => {
    req.session.userId = null;
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
};






