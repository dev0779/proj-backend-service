import { gql } from "apollo-server-express";

export const currentUserTypeDefs = gql`
  type Query {
    currentUser: UserResponse!
  }

  type User {
    id: Int!
    userId: String!
    username: String
    first_name: String
    last_name: String
    email: String
    status: UserRole
    lastLoggedIn: DateTime
  }

  type UserResponse {
    success: Boolean!
    message: String
    data: User
  }

  enum UserRole {
    ADMIN
    USER
    SUPERVISOR
    VISITOR
    IT
    SUPPORT
    HR
  }
`;
