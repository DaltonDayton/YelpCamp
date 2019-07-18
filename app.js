var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport Configuration
app.use(
    require("express-session")({
        secret: "Storm and Sadie are the cutest dogs.",
        resave: false,
        saveUninitialized: false
    })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

// ==============
// === Routes ===
// ==============

// Home Page
app.get("/", (req, res) => {
    res.render("landing");
});

// INDEX
// Campground Page (GET)
app.get("/campgrounds", (req, res) => {
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
app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// SHOW
// Campground Show Page
app.get("/campgrounds/:id", (req, res) => {
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

// ======================
// === Comment Routes ===
// ======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    // Find campground by id
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    // Lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // Connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect to campground show page
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// ===================
// === Auth Routes ===
// ===================

// Show register form
app.get("/register", (req, res) => {
    res.render("register");
});

// Handle sign up logic
app.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
app.get("/login", (req, res) => {
    res.render("login");
});

app.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    })
);

// Logout Route
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/campgrounds");
});

// Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Listen
app.listen(3000, () => {
    console.log("Server Initiated on port 3000.");
});
