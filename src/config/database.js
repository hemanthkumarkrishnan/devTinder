const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://hemanthkrishna944_db_user:NJwtfOBsoF46i7nI@devtinder.wo8sdyy.mongodb.net/?appName=DevTinder"
  );
};
module.exports = connectDB
