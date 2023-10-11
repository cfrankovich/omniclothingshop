import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userResolvers = {
  Query: {
    allUsers: async () => {
      const users = await prisma.user.findMany();
      return users;
    },
  },
};
