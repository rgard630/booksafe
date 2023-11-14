// GraphQL schema definition specifying input types, object types, and operations
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Input type for user data used in mutations and queries
  input UserInput {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [BookInput]!
  }

  # Input type for book data used in mutations
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  # Object type representing a User in the system
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  # Object type representing a Book in the system
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;
