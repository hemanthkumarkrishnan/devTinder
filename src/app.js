const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./Middleware/Auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

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
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$9442",{
        expiresIn:"7d"
      });

      res.cookie("token", token,{
        expires:new Date(Date.now()+ 8 *3600000)
      });
      res.send("Login sucessful!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("error in adding user: " + err.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

app.post("/sendConnectionRequest",userAuth,(req,res)=>{
  const user = req.user;
  res.send(user.firstName +"sent connection request")
})

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
