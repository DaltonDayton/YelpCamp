var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, (req, res) => {
	// Find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", { campground: campground });
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
	// Lookup campground using ID
	Campground.findById(req.params.id, (err, campground) => {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// Create new comment
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment
					comment.save();
					// Connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// Redirect to campground show page
					req.flash("success", "Successfully added comment.");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// Comments Edit
router.get(
	"/:comment_id/edit",
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			} else {
				if (!foundComment) {
					req.flash("error", "Comment not found.");
					return res.redirect("/campgrounds");
					// return res.status(400).send("Item not found.");
				}
				res.render("comments/edit", {
					campground_id: req.params.id,
					comment: foundComment
				});
			}
		});
	}
);

// Comments Update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(
		req.params.comment_id,
		req.body.comment,
		(err, updatedComment) => {
			if (err) {
				res.redirect("back");
			} else {
				if (!updatedComment) {
					req.flash("error", "Campground not found.");
					return res.redirect("/campgrounds");
					// return res.status(400).send("Item not found.");
				}
				res.redirect("/campgrounds/" + req.params.id);
			}
		}
	);
});

// Comments Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
		if (err) {
			res.redirect("back");
		} else {
			if (!comment) {
				req.flash("error", "Campground not found.");
				return res.redirect("/campgrounds");
				// return res.status(400).send("Item not found.");
			}
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

module.exports = router;
