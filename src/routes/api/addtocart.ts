import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/add-to-cart", async (req, res) => {
  const { id } = req.body;

  if (!req.session.cartInitialized) {
    req.session.cartInitialized = true;
  }

  let cart;
  cart = await prisma.cart.findUnique({
    where: { sessionId: req.sessionID },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        sessionId: req.sessionID,
      },
    });
  }

  let cartItem = await prisma.cartItem.findFirst({
    where: {
      garmentId: id,
      cartId: cart.sessionId,
    },
  });

  if (cartItem) {
    cartItem = await prisma.cartItem.update({
      where: {
        cartItemId: cartItem.cartItemId,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        cartId: cart.sessionId,
        garmentId: id,
        quantity: 1,
      },
    });
  }

  res.json({ success: true });
});

export default router;
