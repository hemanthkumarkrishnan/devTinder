const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} ,your profile updated succcessful`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Both oldPassword and newPassword are required");
    }

    const user = req.user;

    // Verify old password
    const isOldPasswordCorrect = await user.validatePassword(oldPassword);
    if (!isOldPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }

    // Validate new password strength
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }

    // Hash and update the password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashed;
    await user.save();    
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
