const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
       res.status(401).send("please Log in!!");
    }
    const decodedObj = await jwt.verify(token, "DEV@Tinder$9442");

    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
   return next();
  } catch (err) {
    return res.status(401).send("unauthorized request");
  }
};

module.exports = {
  userAuth,
};
