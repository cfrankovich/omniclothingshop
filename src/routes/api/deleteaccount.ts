import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/delete-account", async (req, res) => {
  try {
    const deleteUser = await prisma.user.delete({
      where: { username: req.session.username },
    });
  } catch (error) {
    res.status(500).send(error);
  }

  try {
    const cartItems = await prisma.cartItem.deleteMany({
      where: { cartId: req.session.id },
    });
    const cart = await prisma.cart.delete({
      where: { sessionId: req.session.id },
    });
  } catch (error) {
    console.error("Error removing cart.", error);
    res.status(500).send(error);
  }

  req.session.destroy((err) => {});
  res.status(200);
});

export default router;
