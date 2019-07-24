$(document).on("click", "#saveArticle", function () {
    var thisArticle = $(this)
    console.log("this article:", thisArticle);
});

$(document).on("click", "#navScrape", function () {
    $.get("/scrape", function (req, res) {
        console.log("Articles Scraped!");
    })
});