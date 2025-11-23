const mongose = require("mongoose");

const userSchema = new mongose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    minLength: [3, "username minimum length required is 3"],
  },
  favoriteGenre: {
    type: String,
    required: [true, "Required to have a favorite genre"],
    minLength: [3, "Favorite Genre minimum length required is 3"],
  },
});

module.exports = mongose.model("User", userSchema);
