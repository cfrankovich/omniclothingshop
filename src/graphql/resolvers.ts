import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        allGarments: async () => {
            const garments = await prisma.garment.findMany();
            return garments;
        }
    }
};

export default resolvers;