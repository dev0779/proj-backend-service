import bcrypt from "bcrypt";
import { userValidators } from "../../validators/index.js";
import { errorResponse, successResponse } from "../../utils/responseHelpers.js";
import { formatValidationErrors } from "../../utils/responseHelpers.js";

export const userResolvers = {
  Query: {
    users: async (_, __, { prisma }) =>
      prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        select: {
          userId: true,
          first_name: true,
          last_name: true,
          username: true,
          email: true,
          status: true,
        },
      }),
  },
  Mutation: {
    createUser: async (_, args, { prisma }) => {

      const validation = userValidators.safeParse(args.input);
      if (!validation.success) {
        return errorResponse({
          message: "Validation failed.",
          errors: formatValidationErrors(validation.error),
        });
      }

      try {
        const findUser = await prisma.user.findUnique({
          where: { username: args.input.username },
        });
        if (findUser) {
          return errorResponse({
            message: "Username is taken.",
            errors: [
              { field: "username", message: "Username is already in use." },
            ],
          });
        }
        const { password, ...rest } = args.input;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
          data: {
            ...rest,
            password: hashedPassword,
          },
        });

        return {
          success: true,
          message: "User created successfully.",
          user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
          },
        };
      } catch (error) {
        console.error(error);
        return errorResponse({ message: "Failed to create user.", data: null });
      }
    },

    editUser: async (_, args, { prisma, currentUser }) => {
      const { password, ...rest } = args.input;
      /*   if (currentUser.status !== 'ADMIN' && currentUser.userId !== args.userId) {
           return errorResponse({
                message: 'Unauthorized to delete this user.',
              });
      } */

      try {

        const user = await prisma.user.findUnique({ where: { userId: args.userId } });
          if (!user) {
            return errorResponse({ message: "User not found." , data: null});
          }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const userUpdate = await prisma.user.update({
          where: { userId: args.userId },
          data: { ...rest, password: hashedPassword },
        });

        return successResponse({
          message: "User updated successfully.",
          data: userUpdate,
        });
      } catch (error) {
        return errorResponse({
          message: "Failed to update user.",
          data: null,
        });
      }
    },

    deleteUser: async (_, args, { prisma }) => {
      /*     if (currentUser.status !== 'ADMIN' && currentUser.userId !== args.userId) {
           return errorResponse({
                message: 'Unauthorized to delete this user.',
              });
       } */

      try {

        const user = await prisma.user.findUnique({ where: { userId: args.userId } });
          if (!user) {
            return errorResponse({ message: "User not found.", data: null });
          }

        const userDelete = await prisma.user.delete({
          where: { id: args.userId },
        });

        return successResponse({
          message: "User deleted successfully.",
          data: userDelete,
        });
      } catch (error) {
        return errorResponse({
          message: "Failed to delete user.",
          data: null,
        });
      }
    },
  },
};
