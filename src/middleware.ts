import session from "express-session";
import pg from "pg";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

export const bodyParsingMiddleware = bodyParser.json();

export const corsMiddleware = cors({
  origin: "http://localhost:3000",
  credentials: true,
});

const pgSession = require("connect-pg-simple")(session);

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const sessionMiddleware = session({
  store: new pgSession({
    pool: pgPool,
    tableName: "Session",
  }),
  secret: "secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});
