const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  console.log(req.body);
  try {
    await user.save();
    res.send("user added sucessesful");
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const userall = await User.find({});
    res.send(userall);
  } catch (err) {
    res.status(400).status("something went wrong");
  }
});
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).status("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).status("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    // const user = await User.findByIdAndDelete(userId);
    const user = await User.findByIdAndDelete({_id:userId});
    res.send("user  deleted sucessesful");
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
   
    const user = await User.findByIdAndUpdate({_id:userId},data);
    console.log(user)
    res.send("user data updated!!");
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
