import express from "express";

const router = express.Router();

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {});
});

export default router;
