import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";
import { hash, verify } from "argon2";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
const pgSession = require("connect-pg-simple")(session);

app.use(bodyParser.json());
app.use(cors());
app.use(
  session({
    store: new pgSession({
      prisma,
      tableName: "Session",
    }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ prisma }),
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error starting the server:", err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.get("/styles.css", (req, res) => {
  res.setHeader("Content-Type", "text/css");
  res.sendFile(path.join(__dirname, "public", "styles.css"));
});

app.post("/signup", async (req, res) => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;
  const hashedPassword: string = await hash(password);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });
    res.json(newUser);
    console.log("Created new user.");
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { email: true, hashedPassword: true },
    });

    if (user === null) {
      console.log("user not found");
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
    res.status(500).json({ error: "Failed to login." });
  }
});

app.post("/test/savegarments", async (req, res) => {
  console.log(req.body.garments);

  req.body.garments.forEach(async (item: any) => {
    try {
      const garment = await prisma.garment.findUnique({
        where: { id: parseInt(item.id, 10) },
      });

      if (garment) {
        const { brand, title, price, color, size, forSale } = item;
        const updatedGarment = await prisma.garment.update({
          where: { id: item.id },
          data: {
            brand,
            title,
            price,
            color,
            size,
            forSale,
          },
        });
      } else {
        const { brand, title, price, color, size, forSale } = item;
        try {
          const newGarment = await prisma.garment.create({
            data: {
              brand,
              title,
              price,
              color,
              size,
              forSale,
            },
          });
          console.log("Added new garment.");
        } catch (error) {
          console.error("Error adding garment:", error);
          res.status(500).json({ error: "Failed to add garment." });
        }
      }
    } catch (error) {
      console.error("Error querying garment:", error);
      res.status(500).json({ error: "Failed to query garment" });
    }
  });
});

app.post("/test/deletegarments", async (req, res) => {
  const ids = req.body.ids;
  try {
    const deleteResponse = await prisma.garment.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    res.status(200).send(deleteResponse);
  } catch (err) {
    res.status(500).send(err);
  }
});
