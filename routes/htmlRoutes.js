const db = require("../models");

module.exports = function (app) {
    // Load Index Page
    app.get("/", function (req, res) {
        db.Article.find({})
            .then(function (data) {
                res.render("index", { article: data })
            });
    });
}