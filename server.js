const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const socketService = require('./services/socketService');
const authRoutes = require('./routes/authRoute');
const usersRoutes = require('./routes/usersRoute');
const conversationRoutes = require('./routes/conversationRoute');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Connexion à la base de données
connectDB().then(() => {
  console.log('MongoDB connected successfully');

  // Lancer le serveur HTTP
  const server = app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on port ${process.env.PORT || 4000}`);
  });

  // Initialiser WebSocket avec l'instance du serveur
  socketService.init(server);

}).catch(err => {
  console.log('Error connecting to MongoDB', err);
});

// Routes API classiques
app.use('/api/auth', authRoutes);
  app.use('/api/users', auth, usersRoutes);
  app.use('/api/conversations', auth, conversationRoutes);
  app.use('/api/forums', auth, forumRoutes);

