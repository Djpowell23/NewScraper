// Dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var db = require("./models");
var path = require("path");
var app = express();
var axios = require("axios");
var cheerio = require("cheerio");

// Port Declaration
var PORT = 3000;

// Configure Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Connecting to MongoDB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes
// require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// A GET route for scraping news articles
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.gamesradar.com/news/").then(function (response) {
        var $ = cheerio.load(response.data);

        // Go through each article div tag and get articles based on the results.
        $("a.article-link").each(function (i, element) {
            var result = {};
            var validResults = {};

            result.link = $(this).attr("href");
            console.log("Link:", result.link);
            result.title = $(this).children("article").children("div.content").children("header").children("h3").text();
            console.log("Title:", result.title);
            var summary = $(this).children("article").children("div.content").children("p.synopsis").text();
            result.summary = summary.substr(summary.indexOf('\n') + 1);

            console.log("Summary:", result.summary);

            validResults.title = result.title;
            validResults.link = result.link;
            validResults.summary = result.summary;

            db.Article.create(validResults)
                .then(function (article) {
                    console.log(article);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape complete");
    });
});

// Route for getting all articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles Collection
    db.Article.find({})
        .then(function (article) {
            res.json(article);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by Id, populate it with it's note.
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (article) {
            res.json(article);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (note) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: note._id }, { new: true });
        })
        .then(function (article) {
            // If unable to update an Article, send it back to the client
            res.json(article);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for clearing all of the articles


// Start the Server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
