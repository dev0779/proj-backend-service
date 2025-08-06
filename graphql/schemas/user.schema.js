import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  type User {
    id: Int!
    first_name: String!
    last_name: String!
    username: String!
    email: String!
    password: String!
    status: String!
  }

  input CreateUserInput {
    first_name: String
    last_name: String
    email: String
    username: String
    password: String
    status: String
  }

  input UpdateUserInput {
    first_name: String
    last_name: String
    email: String
    username: String
    password: String
    status: String
  }

  type Query {
    users: [User!]!
  }

  type CreateUserResponse {
    success: Boolean!
    message: String!
    user: User
  }
  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse!
    editUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): User!
  }
`;
