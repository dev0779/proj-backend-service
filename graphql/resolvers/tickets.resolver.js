import { nullable } from "zod/mini";
import { errorResponse, successResponse } from "../../utils/responseHelpers";

export const ticketsResolver = {
  Query: {
    tickets: async (root, args, { prisma }) => {
      return await prisma.tickets.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          status: true,
          createdBy: true,
          userId: true
        },
      });
    },

    ticket: async (root, { id }, { prisma }) => {
      
      try {
        const findTicket = await prisma.ticket.findUnique({ where: { id: id } })
        
        if (findTicket) {
          return successResponse({
            message: 'ticket found',
            data:findTicket
          })
        } else {
          return errorResponse({
            message: 'Ticket not Found',
            errors: [],
            data:null
          })
        }
      } catch(err){
        return errorResponse({
          message: 'Not able to find Ticket',
          errors: [err.message],
          data:null
        })
      }
      
    }
  },

  Mutation: {
    createTicket: async (root, { input }, { prisma }) => {
      try {
        const newTicket = await prisma.ticket.create({
          data: { ...input },
        });
        return successResponse({
          message: "ticket created",
          data: newTicket,
        });
      } catch (err){
        return errorResponse({
          message: "Failed to create new Ticket",
          errors: [err.message],
          data: null,
        });
      }
    },
    updateTicket: async (root, { input }, { prisma }) => {
      try {
        const updatedTicket = await prisma.ticket.update({
          where: { id: Number(input.id) },
          data: {
            title: input.title,
            description: input.description,
            status: input.status,
            createdBy: input.createdBy,
            userId:input.userId
          },
        });

        return successResponse({
          message: "ticket updated",
          data: updatedTicket,
        });
      } catch (err){
        return errorResponse({
          message: "Updated failed",
          errors: [err.message],
          data: null,
        });
      }
    },
    deleteTicket: async (root, { id }, { prisma }) => {
      try {
        const ticket = await prisma.ticket.findUnique({
          where: { id: Number(id) },
        });
        if (!ticket) {
          return errorResponse({
            message: "ticket not found",
            errors: [],
            data: null,
          });
        }
        const deletedTicket = await prisma.ticket.delete({
          where: { id: Number(id) },
        });
        return successResponse({
          messafe: "Ticket deleted",
          data: deletedTicket,
        });
      } catch (err){
        return errorResponse({
          message: "Failed to delete Ticket",
          errors: [err.message],
          data: null,
        });
      }
    },
  },
};
