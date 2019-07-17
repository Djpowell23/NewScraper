const db = require("../models");

module.exports = function (app) {
    // Load Index Page
    app.get("/", function (req, res) {
        res.render("index");
    })
}