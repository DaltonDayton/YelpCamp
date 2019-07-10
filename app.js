var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Granite Hill",
//         image:
//             "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_452,q_75,w_982/http://res.cloudinary.com/simpleview/image/upload/v1469218578/clients/lanecounty/constitution_grove_campground_by_natalie_inouye_417476ef-05c3-464d-99bd-032bb0ee0bd5.png"
//     },
//     function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("Newly created campground: ");
//             console.log(campground);
//         }
//     }
// );

// Home Page
app.get("/", (req, res) => {
    res.render("landing");
});

// Campground Page (GET)
app.get("/campgrounds", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", { campgrounds: allCampgrounds });
        }
    });
});

// Campground Page (POST)
app.post("/campgrounds", (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = { name: name, image: image };
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

// Add Campground Page
app.get("/campgrounds/new", (req, res) => {
    res.render("new.ejs");
});

// Listen
app.listen(3000, () => {
    console.log("Server Initiated on port 3000.");
});
