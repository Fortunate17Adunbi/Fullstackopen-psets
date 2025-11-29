const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
require("dotenv").config();

mongoose.set("strictQuery", false);
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("error connection to MongoDB:", error.message));

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 */

// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "Demons",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ];

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String! 
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: String
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
    allUsers: [User!]!
  }

  type Mutation {
    addBook(
      title: String! 
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor (
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`;

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

      return bookTosave.save().catch((error) => {
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
      });
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
    bookCount: async (root) => {
      const book = await Book.find({});
      // console.log("gbogbo book ", book);
      return book.reduce((obj, book) => {
        return book.author.toString() === root.id.toString() ? obj + 1 : obj;
      }, 0);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.SECRET_PHRASE
      );

      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
