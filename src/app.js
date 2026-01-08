const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
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
});
app.post("/login", async (req, res) => {
  try {
    const {emailId, password } = req.body;

    const user = await User.findOne({emailId:emailId});

    if(!user){
      throw new Error("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(isPasswordValid){
      res.send("Login sucessful!!")
    }else{
       throw new Error("Invalid credentials")
    }
    
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
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user  deleted sucessesful");
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  const allowedEdits = ["gender", "skills", "about"];
  try {
    const incomindedit = Object.keys(data).every((x) => {
      return allowedEdits.includes(x);
    });

    if (!incomindedit) {
      throw new Error("Not allower to edit this fields");
    }

    if (req.body.skills.length > 5) {
      throw new Error("skills cant crosss more than 5");
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    console.log(user);
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
