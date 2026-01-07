const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json())

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(req.body)
  try {
    await user.save();
    res.send("user added sucessesful");
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected");
    app.listen(3000, () => {
      console.log("Server is up and runnind");
    });
  })
  .catch((err) => {
    console.log("ERR in connecting DB");
  });
