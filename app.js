var express = require("express");
var app = express();

app.set("view engine", "ejs");

// Home Page
app.get("/", (req, res) => {
    res.render("landing");
});

// Campground Page
app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        {
            name: "Salmon Creek",
            image:
                "https://www.nps.gov/shen/planyourvisit/images/20170712_A7A9022_nl_Campsites_BMCG_960.jpg?maxwidth=1200&maxheight=1200&autorotate=false"
        },
        {
            name: "Granite Hill",
            image:
                "https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,h_452,q_75,w_982/http://res.cloudinary.com/simpleview/image/upload/v1469218578/clients/lanecounty/constitution_grove_campground_by_natalie_inouye_417476ef-05c3-464d-99bd-032bb0ee0bd5.png"
        },
        {
            name: "Mountain Goat's Rest",
            image:
                "https://static.rootsrated.com/image/upload/s--_i1nqUT1--/t_rr_large_traditional/oy9xsbijv8wehnrzv0zt.jpg"
        }
    ];
    res.render("campgrounds", { campgrounds: campgrounds });
});

// Listen
app.listen(3000, () => {
    console.log("Server Initiated on port 3000.");
});
