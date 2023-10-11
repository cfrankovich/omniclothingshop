import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/save-user", async (req, res) => {
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

export default router;
