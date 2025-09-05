import bcrypt from "bcrypt";
import { userValidators } from "../../validators/index.js";
import { errorResponse, successResponse } from "../../utils/responseHelpers.js";
import { formatValidationErrors } from "../../utils/responseHelpers.js";

export const userResolvers = {
  Query: {
    users: async (root, args, { prisma }) => {
      try {
        const users = await prisma.user.findMany({
          orderBy: { createdAt: "asc" },
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            status: true,
          },
        });
        return successResponse({
          message: 'Avaliable users',
          data:users
        })
        
      } catch (err) {
        return errorResponse({
          message: 'Fail to fetch users',
          data: null,
          errors:[]
        })
      }
    }

  },
  Mutation: {
    createUser: async (root, args, { prisma }) => {
      const validation = userValidators.safeParse(args.input);
      if (!validation.success) {
        return errorResponse({
          message: "Validation failed.",
          errors: formatValidationErrors(validation.error),
          data: null,
        });
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { username: args.input.username },
        });
        if (existingUser) {
          return errorResponse({
            message: "Username is taken.",
            errors: [{ field: "username", message: "Username is already in use." }],
            data: null,
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

        return successResponse({
          message: "User created successfully.",
          data: {
            userId: user.userId,
            username: user.username,
            email: user.email,
          },
        });
      } catch (error) {
        console.error("createUser error:", error);
        return errorResponse({
          message: "Failed to create user.",
          errors: [error.message],
          data: null,
        });
      }
    },

    editUser: async (root, { input }, { prisma, currentUser }) => {
      if (!currentUser) {
        return errorResponse({
          message: "Not authenticated",
          errors: [],
          data: null,
        });
      }

      try {
        const updateData = { ...input };

        if (input.password) {
          updateData.password = await bcrypt.hash(input.password, 10);
        } else {
          if ("password" in updateData) delete updateData.password;
        }

        const updatedUser = await prisma.user.update({
          where: { userId: currentUser.userId },
          data: updateData,
        });

        return successResponse({
          message: "User updated successfully",
          data: updatedUser,
        });
      } catch (error) {
        console.error("editUser error:", error);
        return errorResponse({
          message: "Failed to update user",
          errors: [error.message],
          data: null,
        });
      }
    },

    updateUser: async (root, { userId, input, adminPassword }, { prisma, currentUser }) => {
      if (!currentUser) {
        return errorResponse({
          message: "Not authenticated",
          errors: [],
          data: null,
        });
      }

      if (currentUser.status !== "ADMIN") {
        return errorResponse({
          message: "Not authorized",
          errors: [],
          data: null,
        });
      }

      try {
        const adminUser = await prisma.user.findUnique({
          where: { userId: currentUser.userId },
        });

        const valid = await bcrypt.compare(adminPassword, adminUser.password);
        if (!valid) {
          return errorResponse({
            message: "Invalid admin password",
            errors: [],
            data: null,
          });
        }

        const updateData = { ...input };
        if (input.password) {
          updateData.password = await bcrypt.hash(input.password, 10);
        } else {
          if ("password" in updateData) delete updateData.password;
        }

        const updatedUser = await prisma.user.update({
          where: { userId },
          data: updateData,
        });

        return successResponse({
          message: "User updated successfully",
          data: updatedUser,
        });
      } catch (error) {
        console.error("updateUser error:", error);
        return errorResponse({
          message: "Failed to update user",
          errors: [error.message],
          data: null,
        });
      }
    },

    deleteUser: async (root, { userId }, { prisma, currentUser }) => {
      if (!currentUser) {
        return errorResponse({
          message: "Not authenticated",
          errors: [],
          data: null,
        });
      }

      if (
        currentUser.status !== "ADMIN" &&
        currentUser.status !== "SUPERVISOR"
      ) {
        return errorResponse({
          message: "Not authorized",
          errors: [],
          data: null,
        });
      }

      try {
        const user = await prisma.user.findUnique({ where: { userId } });
        if (!user) {
          return errorResponse({
            message: "User not found.",
            errors: [],
            data: null,
          });
        }

        const deletedUser = await prisma.user.delete({
          where: { userId },
        });

        return successResponse({
          message: "User deleted successfully.",
          data: deletedUser,
        });
      } catch (error) {
        console.error("deleteUser error:", error);
        return errorResponse({
          message: "Failed to delete user.",
          errors: [error.message],
          data: null,
        });
      }
    },
  },
};
