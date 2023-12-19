import express from "express";
import { ApolloServer } from "apollo-server-express";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import { PrismaClient } from "@prisma/client";
import path from "path";
import {
  bodyParsingMiddleware,
  corsMiddleware,
  sessionMiddleware,
} from "./middleware";
import signupRoute from "./routes/auth/signup";
import loginRoute from "./routes/auth/login";
import logoutRoute from "./routes/auth/logout";
import currentUserRoute from "./routes/api/currentuser";
import saveGarmentsRoute from "./routes/api/savegarments";
import deleteUsersRoute from "./routes/api/deleteusers";
import saveUsersRoute from "./routes/api/saveuser";
import updateUserRoute from "./routes/api/updateuser";
import deleteAccountRoute from "./routes/api/deleteaccount";
import addToCartRoute from "./routes/api/addtocart";
import checkoutRoute from "./routes/api/checkout";

const app = express();
const port = process.env.PORT || 8080;
export const prisma = new PrismaClient();

declare module "express-session" {
  interface SessionData {
    username: string;
    cartInitialized: boolean;
    lastLogin: Date;
  }
}

app.use(bodyParsingMiddleware);
app.use(corsMiddleware);
app.use(sessionMiddleware);

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

app.use("/auth", signupRoute);
app.use("/auth", loginRoute);
app.use("/auth", logoutRoute);

app.use("/api", currentUserRoute);
app.use("/api", saveGarmentsRoute);
app.use("/api", deleteUsersRoute);
app.use("/api", saveUsersRoute);
app.use("/api", updateUserRoute);
app.use("/api", deleteAccountRoute);
app.use("/api", addToCartRoute);
app.use("/api", checkoutRoute);

const cron = require("node-cron");
cron.schedule("0 0 * * *", async () => {
  const expiryThreshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const expiredCarts = await prisma.cart.findMany({
    where: {
      updatedAt: {
        lt: expiryThreshold,
      },
    },
  });

  for (const cart of expiredCarts) {
    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.sessionId,
      },
    });
  }

  await prisma.cart.deleteMany({
    where: {
      updatedAt: {
        lt: expiryThreshold,
      },
    },
  });
});
