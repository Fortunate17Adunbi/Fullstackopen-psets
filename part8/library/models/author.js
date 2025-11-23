const mongoose = require("mongoose");

// const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name of author is required"],
    unique: [true, "author already exists"],
    minlength: [4, "the name of the author must be at least 4 in length"],
  },
  born: {
    type: Number,
  },
});

// schema.plugin(uniqueValidator);

module.exports = mongoose.model("Author", schema);
