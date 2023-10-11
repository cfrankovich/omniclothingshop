import express from "express";
import { prisma } from "../../index";

const router = express.Router();

router.post("/save-garments", async (req, res) => {
  req.body.garments.forEach(async (item: any) => {
    try {
      const garment = await prisma.garment.findUnique({
        where: { id: parseInt(item.id, 10) },
      });

      const { brand, title, price, color, size, forSale } = item;
      if (garment) {
        const updatedGarment = await prisma.garment.update({
          where: { id: item.id },
          data: {
            brand,
            title,
            price,
            color,
            size,
            forSale,
          },
        });
      } else {
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
          console.log("Added new garment.");
        } catch (error) {
          console.error("Error adding garment:", error);
          res.status(500).json({ error: "Failed to add garment." });
        }
      }
    } catch (error) {
      console.error("Error querying garment:", error);
      res.status(500).json({ error: "Failed to query garment" });
    }
  });
});

export default router;
