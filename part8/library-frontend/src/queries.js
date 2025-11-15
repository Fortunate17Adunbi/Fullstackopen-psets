import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      author
      title
      published
    }
  }
`;

export const ADD_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      author
      title
      published
    }
  }
`;

export const EDIT_BIRTH = gql`
  mutation editBirth($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      id
      name
      born
      bookCount
    }
  }
`;
