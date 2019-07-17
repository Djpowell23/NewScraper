var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models/");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure Middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connecting to MongoDB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect(MONGODB_URI);
// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Routes

// A GET route for scraping news articles
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/section/us").then(function (response) {
        var $ = cheerio.load(response.data);

        // Go through each article div tag and get articles based on the results.
        $("article div").each(function (i, element) {
            var result = {};
            var validResults = {};

            // Some filtering, getting rid of null results
            if ($(this).children("h2").children("a").attr("href") === undefined) {
                result.title = $(this).children("h2").text();
                result.link = $(this).children("h2").children("a").attr("href");
            } else {
                validResults.title = $(this).children("h2").text();
                validResults.link = $(this).children("h2").children("a").attr("href");
                console.log(validResults);
            }

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

// Start the Server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
