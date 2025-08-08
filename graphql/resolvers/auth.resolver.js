import { errorResponse } from "../../utils/responseHelpers.js";
import { signUser } from "../../auth.js"

export const authResolver = {
  Mutation: {
    login: async (_, { email, password }, { prisma, res }) => {
      const user = await prisma.user.findUnique({ where: { email, username } });

      if (!user) {
        return errorResponse({ message: "invalid credentials", data: null });
      }

      const token = signUser()
    },
  },
};
