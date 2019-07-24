

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
    console.log("this:", $(this).attr("data"));
    var thisId = $(this).attr("data");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log("ajax data:", data);
            $("#notes").append("<h5>" + data.title.substring(0, 72) + '...' + "</h5>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button class='btn-large blue waves-effect right' data-id='" + data._id + "' id='saveNote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }


        })
});

$(document).on("click", "#saveNote", function () {
    event.preventDefault();

    var thisId = $(this).attr("data-id");
    console.log("ThisId:", thisId);

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log("last data:", data);
        });
    $("#notes").empty();

    // Remove values entered
    $("#titleinput").val("");
    $("#bodyinput").val("");
});