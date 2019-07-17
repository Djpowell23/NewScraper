var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize Model
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        // Unique to stop from flooding DB with same results
        unique: true
    },
    link: {
        type: String,
        required: true,
        // Unique to stop from flooding DB with same results
        unique: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above Schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;