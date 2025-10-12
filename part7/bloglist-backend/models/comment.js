const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment is required"],
    minLength: 4,
  },
  blogID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
});

mongoose.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
