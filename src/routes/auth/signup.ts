import express from "express";
import { hash } from "argon2";
import { prisma } from "../../index";

const router = express.Router();

router.post("/signup", async (req, res) => {
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
      if (err) {
        console.error(err);
        return res.json({ loggedIn: false });
      }
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

export default router;
