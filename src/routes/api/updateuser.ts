import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/update-user", async (req, res) => {
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

export default router;
