/*
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

module.exports = sequelize;
*/

const mongoose = require('mongoose');
require("dotenv").config({ path: ".env" })
const connectDB = async () => {
  try {
    var uri = process.env.MONGO_URI;
    console.log(uri);
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options like useCreateIndex, useFindAndModify (if needed for your Mongoose version)
    });
   /* const conn = await mongoose.connect("mongodb://mongo:27017/echolink", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // other options like useCreateIndex, useFindAndModify (if needed for your Mongoose version)
    });*/
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
