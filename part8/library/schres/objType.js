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
`;

module.exports = { typeDefs };
