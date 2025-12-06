const { GraphQLError, subscribe } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const jwt = require("jsonwebtoken");
const Author = require("../models/author");
const Book = require("../models/book");
const User = require("../models/user");

const pubsub = new PubSub();
const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // console.log("looking for book");
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];

        const query = args.genre
          ? { author: author._id, genres: args.genre }
          : { author: author._id };

        return Book.find(query).populate({ path: "author" });
      } else if (args.genre) {
        return Book.find({ genres: args.genre }).populate({ path: "author" });
      }
      return Book.find({}).populate({ path: "author" });
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
    allUsers: async () => User.find({}),
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        const authorToSave = new Author({ name: args.author });

        try {
          author = await authorToSave.save();
        } catch (error) {
          if (error.name === "ValidationError") {
            const messageStack = Object.values(error.errors).map(
              (name) => name.message
            );

            throw new GraphQLError(messageStack.join(", "), {
              extensions: {
                code: "BAD_USER_INPUT",
                error,
              },
            });
          }

          throw new GraphQLError("Unable to add book", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }

      const bookTosave = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author,
      });

      try {
        await bookTosave.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          const messageStack = Object.values(error.errors).map(
            (name) => name.message
          );

          throw new GraphQLError(messageStack.join(", "), {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        }
        throw new GraphQLError("Unable to save book", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: bookTosave });

      return bookTosave;
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      try {
        const author = await Author.findOneAndUpdate(
          { name: args.name },
          { $set: { born: args.setBornTo } },
          { new: true, runValidators: true, context: "query" }
        );

        // console.log("author ", author);

        if (!author) {
          throw new GraphQLError("Author does not exist", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
            },
          });
        }

        return author;
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }

        if (error.name === "ValidationError") {
          const messageStack = Object.values(error.errors).map(
            (name) => name.message
          );

          throw new GraphQLError(messageStack.join(", "), {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        }

        throw new GraphQLError("Unable to edit author details", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    createUser: async (root, args) => {
      const newUser = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await newUser.save();
      } catch (error) {
        if (error.name === "ValidationError") {
          const messageStack = Object.values(error.errors).map(
            (name) => name.message
          );

          throw new GraphQLError(messageStack.join(", "), {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        }

        throw new GraphQLError("error saving user", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("Wrong username or password", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.SECRET_PHRASE) };
    },
  },

  Author: {
    bookCount: async (root, args, { bookCountLoader }) => {
      return bookCountLoader.load(root.id);
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => {
        // console.log("fired  heerer");
        return pubsub.asyncIterableIterator("BOOK_ADDED");
      },
    },
  },
};

module.exports = resolvers;
