import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    allGarments: async () => {
      const garments = await prisma.garment.findMany();
      return garments;
    },
    allUsers: async () => {
      const users = await prisma.user.findMany();
      return users;
    },
  },
};

export default resolvers;
