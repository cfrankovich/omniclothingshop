import express from "express";
import { verify } from "argon2";
import { prisma } from "../../index";

const router = express.Router();

router.post("/login", async (req, res) => {
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
          if (err) {
            console.error(err);
            return res.json({ loggedIn: false });
          }
          console.log("password correct");
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

export default router;
