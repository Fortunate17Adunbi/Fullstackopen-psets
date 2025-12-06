require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/book");
const Author = require("../models/author");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("connected to mongodb");
    const authors = await Author.find({});

    for (let i = 0; i < authors.length; i++) {
      let authorBooks = await Book.find({ author: authors[i]._id });
      authors[i].bookCount = authorBooks.length;
      await authors[i].save();
    }
  })
  .catch((error) => console.log("error connection to MongoDB:", error.message));

// Author.find({})
//   .then((authors) => {
//     authors.forEach(async (author) => {
//       const authorBooks = await Book.find({ author: author._id });
//       author.bookCount = authorBooks.length;
//       await author.save();
//     });
//   })
//   .catch(() => mongoose.connection.close());
