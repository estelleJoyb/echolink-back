const mongoose = require('mongoose');
require("dotenv").config({ path: ".env" })
const connectDB = async () => {
  try {
    var uri = process.env.MONGO_URI;
    console.log(uri);
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
