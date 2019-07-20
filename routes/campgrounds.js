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
router.post("/", (req, res) => {
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name: name, image: image, description: desc };
	// Create a new campground and save to DB
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW
// Add Campground Page
router.get("/new", (req, res) => {
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

module.exports = router;
