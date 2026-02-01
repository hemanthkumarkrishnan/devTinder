const corn = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequestModel = require("../models/connectionRequest");

// this job will run 8am everyday in the morning
corn.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const start = startOfDay(yesterday);
    const end = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: start,
        $lt: end,
      },
    }).populate("fromUserId toUserId");

    const listofEmails = [
      ...new Set(pendingRequests.map((request) => request.toUserId.emailId)),
    ];

    console.log("List of Emails to send report to:", listofEmails);

    for (const email of listofEmails) {
      try {
        const res = await sendEmail.run(
          "New  Friend Requests pending for " + email,
          " There are so many new friend requests pending for you. Please check your tinderdev.space account to respond to them.",
        );
        console.log(res);
      } catch (error) {
        console.error(`Error processing requests for email ${email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error occurred while sending daily report:", error);
  }
});
