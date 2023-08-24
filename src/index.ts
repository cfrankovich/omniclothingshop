import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/schema'; 
import  resolvers from './graphql/resolvers'; 
import { PrismaClient } from '@prisma/client';
import { hash, verify } from 'argon2';
import session from 'express-session';
import dotenv from 'dotenv'; 
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
const pgSession = require('connect-pg-simple')(session);

app.use(bodyParser.json());
app.use(cors());
app.use(session({
    store: new pgSession({
        prisma,
        tableName: 'Session'
    }),
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ prisma }),
});

async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app });
}

startApolloServer().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    }).catch((err) => {
    console.error('Error starting the server:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.get('/styles.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

app.post("/signup", async (req, res) => {
    const { username, email, password }: { username:string, email:string, password:string } = req.body;
    const hashedPassword:string = await hash(password);

    try {
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                hashedPassword 
            }
        });
        res.json(newUser);
        console.log("Created new user.");
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({error: "Failed to create user."});
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: { email },
            select: { email:true, hashedPassword:true }
        });

        if (user === null) {
            console.log("user not found")
        } else {
            const isPasswordCorrect = await verify(user.hashedPassword, password); 
            if (isPasswordCorrect) {
                console.log("Password correct!");
            } else {
                console.log("Incorrect password.");
            }
        } 
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({error: "Failed to login."});
    }
});
