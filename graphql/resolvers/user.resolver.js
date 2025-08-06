import bcrypt from "bcrypt";
import { userValidators } from "../../validators/index.js";
import { errorResponse, successResponse } from "../../utils/responseHelpers.js";
import { formatValidationErrors } from "../../utils/responseHelpers.js";

export const userResolvers = {
  Query: {
    users: async (_, __, { prisma }) => prisma.user.findMany(),
  },
  Mutation: {
    createUser: async (_, args, { prisma }) => {
      console.log("createUser resolver called");
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

        console.log("rest", rest);
        console.log("Hashed password:", hashedPassword);
        const user = await prisma.user.create({
          data: {
            ...rest,
            password: hashedPassword,
          },
        });

          return {
              success: true,
              message:'User created successfully.',
              user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
              },
          }
        ;
      } catch (error) {
        console.error(error);
        return errorResponse({ message: "Failed to create user.", data: null });
      }
    },

    editUser: async (_, args, { prisma }) => {
      const { password, ...rest } = args.input;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
          where: { id: args.id },
          data: { ...rest, password: hashedPassword },
        });

        return successResponse({
          message: "User updated successfully.",
          data: user,
        });
      } catch (error) {
        return errorResponse({
          message: "Failed to update user.",
          data: null,
        });
      }
    },

    deleteUser: async (_, args, { prisma }) => {
      try {
        const user = await prisma.user.delete({
          where: { id: args.id },
        });

        return successResponse({
          message: "User deleted successfully.",
          data: user,
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
