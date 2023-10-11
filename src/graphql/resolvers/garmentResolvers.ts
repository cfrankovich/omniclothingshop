import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GarmentByIdArgs {
  id: number;
}

export const garmentResolvers = {
  Query: {
    allGarments: async () => {
      const garments = await prisma.garment.findMany();
      return garments;
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
