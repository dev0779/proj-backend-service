import { gql } from "apollo-server-express";

export const userTypeDefs = gql`
  enum UserRole {
    ADMIN
    USER
    SUPERVISOR
    VISITOR
    IT
    SUPPORT
    HR
  }

  scalar DateTime

  type User {
    id: Int!
    userId: String!
    first_name: String
    last_name: String
    username: String!
    email: String!
    status: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    first_name: String!
    last_name: String!
    email: String!
    username: String!
    password: String!
    status: UserRole
  }

  input EditUserInput {
    first_name: String
    last_name: String
    email: String!
    username: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    first_name: String
    last_name: String
    password: String
    status: UserRole
  }

  type Query {
    users: [User!]!
  }

  type CreateUserResponse {
    success: Boolean!
    message: String!
    user: User
  }

  type UpdateUserResponse {
    success: Boolean!
    message: String!
    data: User
  }

  type DeleteUserResponse {
    success: Boolean!
    message: String!
    data: User
  }

  type Mutation {
    createUser(input: CreateUserInput!): CreateUserResponse!
    editUser(input: EditUserInput!): UpdateUserResponse!
    updateUser(
      userId: String!
      input: UpdateUserInput
      adminPassword: String!
    ): UpdateUserResponse!
    deleteUser(userId: String!): DeleteUserResponse!
  }
`;
