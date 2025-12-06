const Book = require("../models/book");
const DataLoader = require("dataloader");
const mongoose = require("mongoose");

const createBookCount = () => {
  return new DataLoader(async (authorsId) => {
    const objectId = authorsId.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Book.aggregate([
      { $match: { author: { $in: objectId } } },
      { $group: { _id: "$author", bookCount: { $sum: 1 } } },
    ]);

    let idToCount = {};
    result.forEach(
      (author) => (idToCount[author._id.toString()] = author.bookCount)
    );
    return authorsId.map((id) => idToCount[id] || 0);
  });
};

module.exports = { createBookCount };
