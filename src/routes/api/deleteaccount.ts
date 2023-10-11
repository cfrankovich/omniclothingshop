import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/delete-account", async (req, res) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: { username: req.session.username },
    });
    res.status(200).send(deleteUser);
  } catch (error) {
    res.status(500);
  }
});

export default router;
