
import { errorResponse, successResponse } from "../../utils/responseHelpers";
import { faker } from "@faker-js/faker";


const statuses = ["OPEN", "CLOSED", "INPROGRESS", "CANCELED", "WAITING"];


export const sampleTicketsResolver = {
  Query: {
    sampleTickets: async (root, args, { prisma }) => {
      try {

        let users = await prisma.sampleUsers.findMany();
        if (users.length < 5) {

          const seedUsers = Array.from({ length: 5 - users.length }, () => ({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            userId:faker.string.uuid(),
          }))
          await prisma.sampleUsers.createMany({ data: seedUsers });
          users = await prisma.sampleUsers.findMany(); 
        }

        let tickets = await prisma.sampleTickets.findMany();

        if (tickets.length < 10) {
            
        
          const seedTickets = Array.from({ length: 10 - tickets.length }, (_, i) => {
            const createdAt = faker.date.recent({ days: 30 });
            const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
            return {
              title: faker.lorem.sentence(),
              description: faker.lorem.paragraph(),
              status: statuses[Math.floor(Math.random() * statuses.length)],
              createdAt: createdAt,
              updatedAt: updatedAt,
              userId: users[Math.floor(Math.random() * users.length)].userId
            };
          });
            await prisma.sampleTickets.createMany({ data: seedTickets })
            tickets = await prisma.sampleTickets.findMany();
          }


        return successResponse({
          message: 'Sample Tickets fetched successfully',
          data:tickets
        })

        
      } catch (err) {
        console.log(err)
        return errorResponse({
          message: "Failed to fetch sample tickets",
          errors: [err.message],
          data: null,
        });
        
      }

    },

    sampleTicket: async (root, { id }, { prisma }) => {
      
      try {
        const findTicket = await prisma.sampleTickets.findUnique({ where: { id: Number(id) } })
        
        if (findTicket) {
          return successResponse({
            message: 'Ticket found',
            data:findTicket
          })
        } else {
          return errorResponse({
            message: 'Ticket not found',
            errors: [],
            data:null
          })
        }
      } catch (err){
        return errorResponse({
          message: 'Not able to find Ticket',
          errors: [err.message],
          data:null
        })
      }
    }
  },

  Mutation: {
    sampleCreateTicket: async (root, { input }, { prisma, currentUser }) => {
      try {
        const newTicket = await prisma.sampleTickets.create({
          data: { ...input },
        });
        return successResponse({
          message: "ticket created",
          data: newTicket,
          errors:[],
        });
      } catch (err){
        return errorResponse({
          message: "Failed to create new Ticket",
          errors: [err.message],
          data: null,
        });
      }
    },
    sampleUpdateTicket: async (root, { input }, { prisma }) => {
      try {
        const updateTicket = await prisma.sampleTickets.update({
          where: { id: Number(input.id) },
          data: { ...input },
        });

        return successResponse({
          message: "ticket updated",
          data: updateTicket,
          errors:[],
        });
      } catch (err){
        return errorResponse({
          message: "Updated failed",
          errors: [err.message],
          data: null,
        });
      }
    },
    sampleDeleteTicket: async (root, { id }, { prisma }) => {
      try {
        const findTicket = await prisma.sampleTickets.findUnique({
          where: { id: Number(id) },
        });
        if (!findTicket) {
          return errorResponse({
            message: "ticket not found",
            errors: [],
            data: null,
          });
        }
        const deletedTicket = await prisma.sampleTickets.delete({
          where: { id: Number(id) },
        });
        return successResponse({
          messafe: "Ticket deleted",
          data: deletedTicket,
          errors:[]
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
