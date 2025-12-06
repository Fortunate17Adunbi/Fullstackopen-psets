const { ApolloServer } = require("@apollo/server");
const mongoose = require("mongoose");
const { expressMiddleware } = require("@as-integrations/express5");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const resolvers = require("./schres/resolvers");
const rootType = require("./schres/rootType");
const objType = require("./schres/objType");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { useServer } = require("graphql-ws/use/ws");
const { createBookCount } = require("./schres/loaders");
require("dotenv").config();

mongoose.set("strictQuery", false);
mongoose.set("debug", true);
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to mongodb"))
  .catch((error) => console.log("error connection to MongoDB:", error.message));

// const typeDefs = `
//   type User {
//     username: String!
//     favoriteGenre: String!
//     id: ID!
//   }

//   type Token {
//     value: String!
//   }

//   type Book {
//     title: String!
//     author: Author!
//     published: Int!
//     genres: [String!]!
//     id: ID!
//   }

//   type Author {
//     name: String!
//     born: String
//     bookCount: Int!
//     id: ID!
//   }

//   type Query {
//     bookCount: Int!
//     authorCount: Int!
//     allBooks(author: String, genre: String): [Book!]!
//     allAuthors: [Author!]!
//     me: User
//     allUsers: [User!]!
//   }

//   type Mutation {
//     addBook(
//       title: String!
//       author: String!
//       published: Int!
//       genres: [String!]!
//     ): Book

//     editAuthor (
//       name: String!
//       setBornTo: Int!
//     ): Author

//     createUser(
//       username: String!
//       favoriteGenre: String!
//     ): User

//     login(
//       username: String!
//       password: String!
//     ): Token
//   }
// `;

// const resolvers = {
//   Query: {
//     bookCount: async () => Book.collection.countDocuments(),
//     authorCount: async () => Author.collection.countDocuments(),
//     allBooks: async (root, args) => {
//       // console.log("looking for book");
//       if (args.author) {
//         const author = await Author.findOne({ name: args.author });
//         if (!author) return [];

//         const query = args.genre
//           ? { author: author._id, genres: args.genre }
//           : { author: author._id };

//         return Book.find(query).populate({ path: "author" });
//       } else if (args.genre) {
//         return Book.find({ genres: args.genre }).populate({ path: "author" });
//       }
//       return Book.find({}).populate({ path: "author" });
//     },
//     allAuthors: async () => Author.find({}),
//     me: (root, args, context) => {
//       return context.currentUser;
//     },
//     allUsers: async () => User.find({}),
//   },

//   Mutation: {
//     addBook: async (root, args, { currentUser }) => {
//       if (!currentUser) {
//         throw new GraphQLError("Not authenticated", {
//           extensions: {
//             code: "UNAUTHENTICATED",
//           },
//         });
//       }
//       let author = await Author.findOne({ name: args.author });

//       if (!author) {
//         const authorToSave = new Author({ name: args.author });

//         try {
//           author = await authorToSave.save();
//         } catch (error) {
//           if (error.name === "ValidationError") {
//             const messageStack = Object.values(error.errors).map(
//               (name) => name.message
//             );

//             throw new GraphQLError(messageStack.join(", "), {
//               extensions: {
//                 code: "BAD_USER_INPUT",
//                 error,
//               },
//             });
//           }

//           throw new GraphQLError("Unable to add book", {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               invalidArgs: args.author,
//               error,
//             },
//           });
//         }
//       }

//       const bookTosave = new Book({
//         title: args.title,
//         published: args.published,
//         genres: args.genres,
//         author,
//       });

//       return bookTosave.save().catch((error) => {
//         if (error.name === "ValidationError") {
//           const messageStack = Object.values(error.errors).map(
//             (name) => name.message
//           );

//           throw new GraphQLError(messageStack.join(", "), {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               error,
//             },
//           });
//         }
//         throw new GraphQLError("Unable to save book", {
//           extensions: {
//             code: "BAD_USER_INPUT",
//             error,
//           },
//         });
//       });
//     },

//     editAuthor: async (root, args, { currentUser }) => {
//       if (!currentUser) {
//         throw new GraphQLError("Not authenticated", {
//           extensions: {
//             code: "UNAUTHENTICATED",
//           },
//         });
//       }

//       try {
//         const author = await Author.findOneAndUpdate(
//           { name: args.name },
//           { $set: { born: args.setBornTo } },
//           { new: true, runValidators: true, context: "query" }
//         );

//         // console.log("author ", author);

//         if (!author) {
//           throw new GraphQLError("Author does not exist", {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               invalidArgs: args.name,
//             },
//           });
//         }

//         return author;
//       } catch (error) {
//         if (error instanceof GraphQLError) {
//           throw error;
//         }

//         if (error.name === "ValidationError") {
//           const messageStack = Object.values(error.errors).map(
//             (name) => name.message
//           );

//           throw new GraphQLError(messageStack.join(", "), {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               error,
//             },
//           });
//         }

//         throw new GraphQLError("Unable to edit author details", {
//           extensions: {
//             code: "BAD_USER_INPUT",
//             invalidArgs: args,
//             error,
//           },
//         });
//       }
//     },

//     createUser: async (root, args) => {
//       const newUser = new User({
//         username: args.username,
//         favoriteGenre: args.favoriteGenre,
//       });

//       try {
//       } catch (error) {
//         if (error.name === "ValidationError") {
//           const messageStack = Object.values(error.errors).map(
//             (name) => name.message
//           );

//           throw new GraphQLError(messageStack.join(", "), {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               error,
//             },
//           });
//         }

//         throw new GraphQLError("error saving user", {
//           extensions: {
//             code: "BAD_USER_INPUT",
//             invalidArgs: args,
//             error,
//           },
//         });
//       }
//     },

//     login: async (root, args) => {
//       const user = await User.findOne({
//         username: args.username,
//       });

//       if (!user || args.password !== "secret") {
//         throw new GraphQLError("Wrong username or password", {
//           extensions: {
//             code: "BAD_USER_INPUT",
//           },
//         });
//       }

//       const userForToken = {
//         username: user.username,
//         id: user._id,
//       };

//       return { value: jwt.sign(userForToken, process.env.SECRET_PHRASE) };
//     },
//   },

//   Author: {
//     bookCount: async (root) => {
//       const book = await Book.find({});
//       // console.log("gbogbo book ", book);
//       return book.reduce((obj, book) => {
//         return book.author.toString() === root.id.toString() ? obj + 1 : obj;
//       }, 0);
//     },
//   },
// };

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({
    typeDefs: [rootType.typeDefs, objType.typeDefs],
    resolvers: resolvers,
  });

  // Defining schema for ws
  const serverCleanup = useServer(
    {
      schema,
      context: async () => ({
        bookCountLoader: createBookCount(),
      }),
    },
    wsServer
  );

  // Creating instance of Apollo server and definig schema (for http) and plugins
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.SECRET_PHRASE
          );

          const currentUser = await User.findById(decodedToken.id);
          return { currentUser, bookCountLoader: createBookCount() };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`server is now running on http://localhost:${PORT}`);
  });
};

start();
