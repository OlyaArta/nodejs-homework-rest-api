const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");
const { joiSubSchema } = require("../../model/user");

const { BadRequest } = require("http-errors");

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.sendStatus(204);
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

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);
    // await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFileName);
    await Jimp.read(tempUpload)
      .then((avatar) => {
        return avatar.resize(250, 250).write(tempUpload);
      })
      .catch((err) => {
        throw err;
      });
    await fs.rename(tempUpload, fileUpload);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);

module.exports = router;
