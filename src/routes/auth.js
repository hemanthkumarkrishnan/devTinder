const express = require("express");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const authRouter = express.Router();

authRouter.post("/signup",async (req,res)=>{
      try {
        // validation of input
        validateSignupData(req);
    
        const { firstName, lastName, emailId, password } = req.body;
        // encrypting the assword
        const passwordHash = await bcrypt.hash(password, 10);
    
        const user = new User({
          firstName,
          lastName,
          emailId,
          password: passwordHash,
        });
    
        await user.save();
        res.send("user added sucessesful");
      } catch (err) {
        res.status(400).send("error in adding user: " + err.message);
      }
})
authRouter.post("/login",async (req,res)=>{
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
      res.send("Login sucessful!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
})
authRouter.post("/logout",async (req,res)=>{
 res.cookie("token",null,{
    expires:new Date(Date.now()),
 })
 res.send("logged out sucessful")
})



module.exports =authRouter;
