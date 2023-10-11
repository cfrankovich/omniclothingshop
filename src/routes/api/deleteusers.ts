import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/delete-users", async (req, res) => {
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

export default router;
