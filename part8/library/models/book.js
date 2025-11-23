const mongoose = require("mongoose");

// // you must install this library
// const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    unique: [true, "book with the title already exists"],
    minlength: [5, "the required length for title is 5"],
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
  },
  genres: [{ type: String }],
});

// schema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", schema);
