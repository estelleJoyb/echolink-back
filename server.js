const express = require('express');
const WebSocket = require('ws');
const connectDB = require('./config/db');
const cors = require("cors");
const socketService = require('./services/socketService');
const authRoutes = require('./routes/authRoute');
const usersRoutes = require('./routes/usersRoute');
const conversationRoutes = require('./routes/conversationRoute');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

connectDB().then(() => {
  console.log('MongoDB connected successfully');

  const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on port ${process.env.PORT || 4000}`);
  });

  const wss = new WebSocket.Server({ server });

  socketService(wss);

}).catch(err => {
  console.log('Error connecting to MongoDB', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/conversations', conversationRoutes);

