const express = require("express");

const { User } = require("../../model");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/current", authenticate, async (req, res, next) => {
  const { email } = req.user;
  res.json({
    user: {
      email,
    },
  });
});

module.exports = router;
