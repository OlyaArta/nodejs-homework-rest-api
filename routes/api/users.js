const express = require("express");

const { User } = require("../../model");
const { authenticate } = require("../../middlewares");
const { joiSubSchema } = require("../../model/user");

const { BadRequest } = require("http-errors");

const router = express.Router();

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res, next) => {
  const { email } = req.user;
  res.json({
    user: {
      email,
    },
  });
});

router.patch("/", authenticate, async (req, res, next) => {
  try {
    const { error } = joiSubSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { _id } = req.user;
    const { subscription } = req.body;
    const updateContact = await User.findByIdAndUpdate(
      _id,
      { subscription },
      { new: true }
    );
    res.json(updateContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
