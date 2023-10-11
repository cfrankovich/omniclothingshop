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
import pg from "pg";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const prisma = new PrismaClient();
const pgSession = require("connect-pg-simple")(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

declare module "express-session" {
  interface SessionData {
    username: string;
  }
}

app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    store: new pgSession({
      pool: pgPool,
      tableName: "Session",
    }),
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
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
    req.session.username = username;
    req.session.save((err) => {
      return res.json({
        loggedIn: true,
        username: username,
      });
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user." });
  }
});

app.get("/api/current-user", async (req, res) => {
  if (req.session.username) {
    return res.json({
      loggedIn: true,
      username: req.session.username,
    });
  } else {
    return res.json({
      loggedIn: false,
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {});
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { username: true, email: true, hashedPassword: true },
    });

    if (user === null) {
      console.log("user not found");
    } else {
      const isPasswordCorrect = await verify(user.hashedPassword, password);
      if (isPasswordCorrect) {
        req.session.username = user.username;
        req.session.save((err) => {
          return res.json({
            loggedIn: true,
            username: user.username,
          });
        });
      } else {
        console.log("Incorrect password.");
        res.json({
          loggedIn: false,
        });
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

      const { brand, title, price, color, size, forSale } = item;
      if (garment) {
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

app.post("/test/deleteusers", async (req, res) => {
  const ids = req.body.ids;
  try {
    const deleteResponse = await prisma.user.deleteMany({
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

app.post("/test/saveusers", async (req, res) => {
  req.body.users.forEach(async (item: any) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(item.id, 10) },
      });

      const { username, email } = item;
      if (user) {
        const updatedGarment = await prisma.user.update({
          where: { id: item.id },
          data: {
            username,
            email,
          },
        });
      }
    } catch (error) {
      console.error("Error querying garment:", error);
      res.status(500).json({ error: "Failed to query garment" });
    }
  });
});

app.post("/api/update-user", async (req, res) => {
  const newUser = req.body.newUser;

  try {
    const user = await prisma.user.findUnique({
      where: { username: req.session.username },
    });

    if (user) {
      const { username } = newUser;

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          username,
        },
      });
      req.session.username = username;
      req.session.save((err) => {
        return res.json({
          loggedIn: true,
          username: username,
        });
      });
    }
  } catch (error) {
    console.error("Error updating user.", error);
    res.status(500).json({ error: "Failed to update user. " });
  }
});

app.post("/api/delete-account", async (req, res) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: { username: req.session.username },
    });
    res.status(200).send(deleteUser);
  } catch (error) {
    res.status(500);
  }
});
