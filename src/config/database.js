const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hemanthKumar:jHuwzZ0cPEIAJSEH@helloworld.e5454af.mongodb.net/"
  );
};
module.exports = connectDB
