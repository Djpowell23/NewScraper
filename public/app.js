$(document).on("click", "#saveArticle", function () {
    event.preventDefault();
    var thisArticle = $(this)
    console.log("this article:", thisArticle);
});

$(document).on("click", "#navScrape", function () {
    event.preventDefault();
    $.get("/scrape", function (req, res) {
        console.log("Articles Scraped!");
    }).then(function () {
        location.reload();
    })
});

$(document).on("click", "#navClear", function () {
    event.preventDefault();
    $("#articles").empty();
});

$(document).on("click", "#addNote", function () {
    event.preventDefault();
    console.log("this:", $(this));
});