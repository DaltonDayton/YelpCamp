var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
				currentUser: req.user,
				page: "campgrounds"
			});
		}
	});
});

// CREATE
// Campground Page (POST)
router.post("/", middleware.isLoggedIn, (req, res) => {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;

	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCampground = {
		name: name,
		price: price,
		image: image,
		description: desc,
		author: author
	};
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
				if (!foundCampground) {
					req.flash("error", "Campground not found.");
					return res.redirect("/campgrounds");
					// return res.status(400).send("Item not found.");
				}
				// console.log(foundCampground);
				// Render show template with that campground
				res.render("campgrounds/show", { campground: foundCampground });
			}
		});
});

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		if (!foundCampground) {
			req.flash("error", "Campground not found.");
			return res.redirect("/campgrounds");
			// return res.status(400).send("Item not found.");
		}
		res.render("campgrounds/edit", { campground: foundCampground });
	});
});

// UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	// Find and update the correct campground
	Campground.findByIdAndUpdate(
		req.params.id,
		req.body.campground,
		(err, updatedCampground) => {
			if (err) {
				res.redirect("/campgrounds");
			} else {
				if (!updatedCampground) {
					req.flash("error", "Campground not found.");
					return res.redirect("/campgrounds");
					// return res.status(400).send("Item not found.");
				}
				// Redirect to the show page
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	);
});

// DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, function(err, campground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			if (!campground) {
				req.flash("error", "Campground not found.");
				return res.redirect("/campgrounds");
				// return res.status(400).send("Item not found.");
			}
			campground.remove();
			req.flash("success", "Campground deleted successfully!");
			res.redirect("/campgrounds");
		}
		// if (err) return next(err);
		// campground.remove();
		// req.flash("success", "Campground deleted successfully!");
		// res.redirect("/campgrounds");
	});
});

module.exports = router;
