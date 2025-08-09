import { gql } from "apollo-server-express";

export const currentUserTypeDefs = gql`
  enum UserRole {
    ADMIN
    USER
    SUPERVISOR
    VISITOR
    IT
    SUPPORT
    HR
  }

  type User {
    id: Int!
    userId: String!
    username: String
    firstName: String
    lastName: String
    email: String
    status: UserRole
    lastLoggedIn: DateTime
  }

  type UserResponse {
    success: Boolean!
    message: String
    data: User
  }

  type LogoutResponse {
  success: Boolean!
  message: String!
}


  type Query {
    currentUser: UserResponse!
  }

  type Mutation {
    login(username: String!, password: String!): UserResponse!
    logout: LogoutResponse!
  }


`;
