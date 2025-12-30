const express = require("express");

const app = express();


app.use("/home", (req, res) => {
  res.send("Hello Home");
});

app.use("/test", (req, res) => {
  res.send("Hello Test");
});
app.use("/", (req, res) => {
  res.send("This is the first server");
});
app.listen(3000, () => {
  console.log("Server is up and runnind");
});
