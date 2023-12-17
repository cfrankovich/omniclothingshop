import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/logout", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.session.username },
    });

    if (user) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoggedIn: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("User not found when trying to logout", error);
  }

  req.session.destroy((err) => {});
});

export default router;
