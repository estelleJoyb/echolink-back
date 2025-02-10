const mongoose = require('mongoose');
const User = require('../models/UserModel');
const messageController = require('../controllers/messageController');

mongoose.connect('mongodb://localhost:27017/echolink', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.log('Erreur de connexion à MongoDB', err));

module.exports = function(wss) {
  const users = {};

  wss.on('connection', (ws) => {
    let currentUserId = null;

    ws.on('message', async (message) => {
      const data = JSON.parse(message);

      if (data.type === 'connect') {
        try {
          const user = await User.findOne({ email: data.email });

          if (user) {
            currentUserId = user._id;
            users[currentUserId] = ws;
            ws.send(JSON.stringify({ type: 'connected', message: `Bienvenue ${user.prenom} ${user.nom}` }));
          } else {
            ws.send(JSON.stringify({ type: 'error', message: 'Utilisateur non trouvé' }));
          }
        } catch (error) {
          console.error(error);
          ws.send(JSON.stringify({ type: 'error', message: 'Erreur lors de la connexion' }));
        }
      }

      if (data.type === 'private_message') {
        messageController.sendPrivateMessage(users, data, currentUserId);
      }
    });

    ws.on('close', () => {
      if (currentUserId) {
        delete users[currentUserId];
      }
    });
  });
};
