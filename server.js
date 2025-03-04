const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const socketService = require("./services/socketService");
const authRoutes = require("./routes/authRoute");
const usersRoutes = require("./routes/usersRoute");
const conversationRoutes = require("./routes/conversationRoute");
const thematiqueRoutes = require("./routes/thematiqueRoute");
require("dotenv").config();
const forumRoutes = require("./routes/forumRoute");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

connectDB()
  .then(() => {
    console.log("MongoDB connected successfully");

    const server = app.listen(process.env.PORT || 4000, () => {
      console.log(`Server started on port ${process.env.PORT || 4000}`);
    });

    socketService.init(server);
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use("/uploads", authMiddleware, express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, usersRoutes);
app.use("/api/conversations", authMiddleware, conversationRoutes);
app.use("/api/forums", authMiddleware, forumRoutes);
app.use("/api/thematiques", authMiddleware, thematiqueRoutes);