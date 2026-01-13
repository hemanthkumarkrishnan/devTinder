const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user.firstName + "sent connection request");
});

module.exports = requestRouter;
