import { gql } from "apollo-server-express";

export const sampleTicketTypeDefs = gql`
scalar DateTime


  enum Status {
    OPEN
    CLOSED
    INPROGRESS
    CANCELED
    WAITING
  }


type Ticket {
    id: ID!
    title: String!
    description: String
    createdAt: DateTime!
    updatedAt: DateTime!
    createdBy: String!
    userId:String
    status: Status!
}
  input CreateTicketInput{
    title:String!
    description:String
    status:Status!
    createdBy: String!
    userId:String
  }

  input UpdateTicketInput{
    title:String!
    description:String
    status:Status!
    createdBy: String!
    userId:String
  }

  type CreateResponse {
    success: Boolean!
    message: String!
    data: Ticket
    errors:[String!]
  }

  type UpdateResponse {
    success: Boolean!
    message: String!
    data: Ticket
    errors:[String!]
  }

  type DeleteResponse {
    success: Boolean!
    message: String!
    data: Ticket
    errors:[String!]
  }

    type TicketsResponse{
    success:Boolean!
    message: String!
    data:[Ticket!]
    errors:[String!]
  }

  type TicketResponse{
    success: Boolean!
    message: String!
    data: Ticket
    errors: [String!] 
  }


type Query {
    sampleTickets: TicketsResponse!
    sampleTicket(id:ID!):TicketResponse!
}


type Mutation {
 sampleCreateTicket(input:CreateTicketInput!): CreateResponse!
 sampleUpdateTicket(input:UpdateTicketInput!) : UpdateResponse!
 sampleDeleteTicket(id:ID!):DeleteResponse!
}

`;
