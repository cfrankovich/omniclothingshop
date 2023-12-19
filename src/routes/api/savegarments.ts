import express from "express";
import { prisma } from "../../index";
import dotenv, { parse } from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

// Returns price id if found null if not
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

// Returns true if success false if fail
async function updateStripePrice(garmentId: string, priceInCents: number) {
  const stripePriceId = await getStripePriceId(garmentId);

  if (!stripePriceId) {
    return false;
  }

  try {
    const updatedStripePrice = await stripe.prices.update(stripePriceId, {
      active: false,
    });
  } catch (error) {
    console.error("Error updating stripe price: ", error);
    return false;
  }

  const newPrice = await createStripePrice(garmentId, priceInCents);
  return newPrice;
}

// Returns true if success false if fail
async function createStripePrice(garmentId: string, priceInCents: number) {
  try {
    const stripePrice = await stripe.prices.create({
      unit_amount: String(priceInCents),
      currency: "usd",
      product: `prod_${garmentId}`,
    });
  } catch (error) {
    console.error("Error creating stripe price: ", error);
    return false;
  }
  return true;
}

// Returns true if success false if fail
async function createStripeProduct(id: string, name: string) {
  try {
    const product = await stripe.products.create({
      id: "prod_" + id,
      name: name,
    });
    return true;
  } catch (error) {
    return false;
  }
}

// Returns garment if found garment, null if not
async function getGarment(garmentId: number) {
  const garment = await prisma.garment.findUnique({
    where: { id: garmentId },
  });
  if (garment) {
    return garment;
  } else {
    return null;
  }
}

// Returns true if the garment was updated
async function updateGarment(garmentData: any) {
  const { brand, title, price, color, size, forSale } = garmentData;
  try {
    const updatedGarment = await prisma.garment.update({
      where: { id: garmentData.id },
      data: {
        brand,
        title,
        price,
        color,
        size,
        forSale,
      },
    });
    return true;
  } catch (error) {
    console.error("Error updating garment in database: ", error);
    return false;
  }
}

// Returns the new garment if created null otherwise
async function createGarment(garmentData: any) {
  const { brand, title, price, color, size, forSale } = garmentData;
  try {
    const newGarment = await prisma.garment.create({
      data: {
        brand,
        title,
        price,
        color,
        size,
        forSale,
      },
    });
    return newGarment;
  } catch (error) {
    console.error("Error creating garment: ", error);
    return null;
  }
}

router.post("/save-garments", async (req, res) => {
  req.body.garments.forEach(async (item: any) => {
    const garment = await getGarment(item.id);
    if (garment != null) {
      const dbResult = await updateGarment(item);
      const stripeResult = await updateStripePrice(
        String(item.id),
        item.price * 100
      );
      console.log(
        dbResult && stripeResult
          ? "Successfully updated database and stripe price."
          : "Failed to update database and stripe price."
      );
    } else {
      const dbResult = await createGarment(item);

      if (dbResult == null) {
        console.log("Failed to create garment in database.");
        return;
      }

      const stripeProductResult = await createStripeProduct(
        String(dbResult.id),
        item.title
      );
      const stripePriceResult = await createStripePrice(
        String(dbResult.id),
        item.price * 100
      );
      console.log(
        dbResult && stripeProductResult && stripePriceResult
          ? "Successfully created garment."
          : "Failed to create garment."
      );
    }
  });
});

export default router;
