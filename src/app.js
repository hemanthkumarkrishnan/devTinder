const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http")

const app = express();


require("dotenv").config();
require("./utils/cornjob");


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter, profileRouter, requestRouter, userRouter,chatRouter);


const server = http.createServer(app)

initializeSocket(server)

connectDB()
  .then(() => {
    console.log("DB connected");
    server.listen(3000, () => {
      console.log("Server is up and established on port 3000");
    });
  })
  .catch((err) => {
    console.log("ERROR in connecting DB");
  });
