const express = require("express");
const { userAuth, adminAuth } = require("./Middleware/Auth");

const app = express();

app.listen(3000, () => {
  console.log("Server is up and runnind");
});

app.use("/user", userAuth);

app.get("/user/getdata", (req, res) => {
  res.send("all data erecei");
});

app.post("/admin", adminAuth, (req, res) => {
  res.send("all admins");
});
