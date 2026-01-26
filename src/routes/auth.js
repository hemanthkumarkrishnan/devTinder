const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { skipMiddlewareFunction } = require("mongoose");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of input
    validateSignupData(req);

    const { firstName, lastName, emailId, password, age, gender, about, photoUrl ,skills} = req.body;
    // encrypting the assword
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      gender,
      about,
      photoUrl,
      skills,
      password: passwordHash
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    res.json({ message: "user added successfully", data: savedUser });
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error in login: " + err.message);
  }
});
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("logged out sucessful");
});

module.exports = authRouter;
