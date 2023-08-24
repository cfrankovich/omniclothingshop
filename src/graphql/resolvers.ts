import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const resolvers = {
    Query: {
        getUserByEmail: async (_:any, { email }: { email:string }) => {
            const user = await prisma.user.findUnique({ 
                where: { email }, 
                select: { username:true, hashedPassword: true }
            });
            return user;
        }
    }
};

export default resolvers;