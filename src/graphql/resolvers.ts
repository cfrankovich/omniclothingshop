import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GarmentByIdArgs {
  id: number;
}

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
    garmentById: async (_: unknown, { id }: GarmentByIdArgs) => {
      const garment = await prisma.garment.findUnique({
        where: {
          id: id,
        },
      });
      return garment;
    },
  },
};

export default resolvers;
