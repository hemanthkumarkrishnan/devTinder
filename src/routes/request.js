const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    console.log("Received request to send connection request");
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        throw new Error(
          `Invalid status. Allowed statuses are: ${allowedStatus.join(", ")}`,
        );
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error(
          "The user you are trying to connect with does not exist",
        );
      }

      if (!mongoose.Types.ObjectId.isValid(toUserId)) {
        throw new Error("Invalid toUserId");
      }
      if (fromUserId.toString() === toUserId) {
        throw new Error("Cannot send connection request to yourself");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error(
          "A connection request already exists between these users",
        );
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      console.log("Connection request saved:");

      const emailResult = await sendEmail.run( "You got a new connection request"+ req.user.firstName,req.user.firstName +
          " is " +
          status +
          " to connect with " +
          toUser.firstName,);
      console.log("email result is " + " " + emailResult);
  
      res.json({
        message:
          req.user.firstName +
          " is " +
          status +
          " to connect with " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      console.log("Reviewing connection request:", requestId);
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        throw new Error(
          `Invalid status. Allowed statuses are: ${allowedStatuses.join(", ")}`,
        );
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      const toUser = await User.findById(connectionRequest.fromUserId);

      res.json({
        message: `You have ${status} the connection request from ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  },
);

module.exports = requestRouter;
