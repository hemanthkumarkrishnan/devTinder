const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not supported incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });


// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     return next(new Error("fromUserId and toUserId cannot be the same"));
//   }

//   next();
// });

const connectRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectRequestModel;
