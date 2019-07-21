var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// INDEX
// Campground Page (GET)
router.get("/", (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
				currentUser: req.user
			});
		}
	});
});

// CREATE
// Campground Page (POST)
router.post("/", isLoggedIn, (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCampground = {
		name: name,
		image: image,
		description: desc,
		author: author
	};
	console.log(req.user);
	// Create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// Redirect back to campgrounds page
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
});

// NEW
// Add Campground Page
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
});

// SHOW
// Campground Show Page
router.get("/:id", (req, res) => {
	// Find campground with provided ID
	Campground.findById(req.params.id)
		.populate("comments")
		.exec((err, foundCampground) => {
			if (err) {
				console.log(err);
			} else {
				// console.log(foundCampground);
				// Render show template with that campground
				res.render("campgrounds/show", { campground: foundCampground });
			}
		});
});

// EDIT Campground Route
router.get("/:id/edit", (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", { campground: foundCampground });
		}
	});
});

// UPDATE Campground Route
router.put("/:id", (req, res) => {
	// Find and update the correct campground
	Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground,
		(err, updatedCampground) => {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	);
	// Redirect to the show page
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
