/*
const express = require("express");
const helmet = require("helmet");
//const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const sequelize = require("./config/db");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(helmet());

// app.use(cors({
//   origin: 'http://localhost:4200', //url du front
//   credentials: true
// }));

app.use(cookieParser());

sequelize
  .authenticate()
  .then(() => console.log("MySQL connected"))
  .catch((err) => console.log("MySQL connection error:", err));

sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Sync error:", err));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
*/


const express = require('express');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const cors = require("cors");
const connectDB = require('./config/db'); // Import the MongoDB connection function
require("dotenv").config();

const app = express();

 app.use(cors({
   origin: 'http://localhost:5173', //url du front
   credentials: true
 }));

// Connect to MongoDB
connectDB().then(r => console.log(r));  // Call the async function to connect


app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
// ...