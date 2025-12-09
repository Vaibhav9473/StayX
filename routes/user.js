const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync');
const bcrypt = require("bcrypt");
const userController = require('../controllers/users.js');
const user = require('../models/user.js');


router
.route('/signup')
.get( userController.renderSignupForm) // SIGNUP PAGE
.post( wrapAsync(userController.signupForm)); // SIGNUP FORM SUBMIT


router
.route('/login')
.get(userController.renderLoginForm) // LOGIN PAGE
.post(userController.loginForm);   // LOGIN FORM SUBMIT


router.get("/logout", userController.logout);

module.exports = router;
