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
    firstName: String
    lastName: String
    username: String!
    email: String!
    status: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    username: String!
    password: String!
    status: UserRole
  }

  input EditUserInput {
    firstName: String
    lastName: String
    email: String!
    username: String!
    password: String!
  }

  input UpdateUserInput {
    username: String
    email: String
    firstName: String
    lastName: String
    password: String
    status: UserRole
  }

  type CreateUserResponse {
    success: Boolean!
    message: String!
    data: User
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

  type UsersResponse{
    success: Boolean!
    message: String!
    data:[User!]
    errors[String!]
  }
  
  type Query {
    users: UsersResponse!
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
