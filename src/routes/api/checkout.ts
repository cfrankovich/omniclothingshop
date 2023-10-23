import express from "express";
import dotenv from "dotenv";
import { prisma } from "../../index";

dotenv.config();

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

async function getStripePriceId(garmentId: string) {
  const stripeProductId = `prod_${garmentId}`;

  try {
    const prices = await stripe.prices.list({ product: stripeProductId });
    if (prices.data.length) {
      return prices.data[0].id;
    }
  } catch (err) {
    console.error("Error fetching prices:", err);
  }

  return null;
}

async function getGarmentIdsFromCart(sessionID: string) {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId: sessionID },
  });

  let garmentIds: number[] = [];
  cartItems.forEach((cartItem) => {
    garmentIds.push(cartItem.garmentId);
  });

  return garmentIds;
}

router.post("/create-checkout-session", async (req, res) => {
  const garmentIds: number[] = await getGarmentIdsFromCart(req.session.id);

  if (garmentIds.length == 0) {
    console.log("Critical Error - No garments found in cart.");
    return;
  }

  let stripeLineItems = [];
  for (const id of garmentIds) {
    let stripePriceId = await getStripePriceId(String(id));
    stripeLineItems.push({
      price: stripePriceId,
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: "payment",
    currency: "usd",
    success_url: "http://localhost:3000/checkout?success=true",
    cancel_url: "http://localhost:3000/checkout?cancelled=true",
  });

  res.json({ url: session.url });
});

export default router;
