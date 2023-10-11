import express from "express";

const router = express.Router();

router.get("/current-user", async (req, res) => {
  if (req.session.username) {
    return res.json({
      loggedIn: true,
      username: req.session.username,
    });
  } else {
    return res.json({
      loggedIn: false,
    });
  }
});

export default router;
