import { currentUserTypeDefs } from "./currentUser.schema.js";
import { sampleTicketTypeDefs } from "./sampleTickets.schema.js";
import { ticketTypeDefs } from "./tickets.schema.js";
import { userTypeDefs } from "./user.schema.js";

export const typeDefs = [userTypeDefs, currentUserTypeDefs, ticketTypeDefs, sampleTicketTypeDefs];
