var express = require("express");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure Middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connecting to MongoDB
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes

// A GET route for scraping news articles

// Route for getting all articles from the db

// Route for grabbing a specific Article by Id, populate it with it's note.

// Route for saving/updating an Article's associated note

// Start the Server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
