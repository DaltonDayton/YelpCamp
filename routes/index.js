var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ==================
// === Root Route ===
// ==================

// Home Page
router.get("/", (req, res) => {
	res.render("landing");
});

// ===================
// === Auth Routes ===
// ===================

// Show register form
router.get("/register", (req, res) => {
	res.render("register", { page: "register" });
});

// Handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({ username: req.body.username });
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// Show login form
router.get("/login", (req, res) => {
	res.render("login", { page: "login" });
});

// Handles Login Logic
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	})
);

// Logout Route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out.");
	res.redirect("/campgrounds");
});

module.exports = router;
