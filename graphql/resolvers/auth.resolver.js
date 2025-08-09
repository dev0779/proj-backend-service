import { errorResponse, successResponse } from "../../utils/responseHelpers.js";
import { signToken, verifyPassword } from "../../auth/auth.js";

export const authResolver = {
  Query: {
    currentUser: async (root, args, { prisma, user }) => {
      if (!user || !user.userId) {
        return errorResponse({ message: "Not authenticated", data: null });
      }

      const currentUser = await prisma.user.findUnique({
        where: { userId: user.userId },
      });

      if (!currentUser) {
        return errorResponse({ message: "User not Found", data: null });
      }

      return successResponse({
        message: `Welcome back ${currentUser.username}`,
        data: {
          user: {
            userId: currentUser.userId,
            username: currentUser.username,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            status: currentUser.status,
            lastLoggedIn: currentUser.lastLoggedIn,
          },
        },
      });
    },
  },
  Mutation: {
    login: async (root, { username, password }, { prisma, res }) => {
      const user = await prisma.user.findUnique({
        where: { username },
      });

      console.log("user", user);

      if (!user) {
        return errorResponse({
          message: "Invalid credentials",
          errors: [],
          data: null,
        });
      }

      const valid = await verifyPassword(password, user.password);
      if (!valid) {
        return errorResponse({
          message: "Invalid credentials",
          errors: [],
          data: null,
        });
      }

      const token = signToken(user);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 10000,
      });

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoggedIn: new Date() },
      });

      return successResponse({
        message: `Welcome back ${user.username}`,
        data: {
            userId: user.userId,
            username:username,
            email: user.email,
            status: user.status,
        },
      });
    },
    logout: (root, args, { res }) => {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return true;
    },
  },
};

export default authResolver;
