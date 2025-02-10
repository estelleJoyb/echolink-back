// services/socketService.js
const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

module.exports = function (wss) {
  const users = {};

  wss.on('connection', (ws) => {
    let currentUserId = null;

    ws.on('message', async (message) => {
      const data = JSON.parse(message);

      if (data.type === 'connect') {
        currentUserId = data.userId;
        users[currentUserId] = ws;
      }

      if (data.type === 'private_message') {
        const { recipientId, text } = data;

        // Vérifier si une conversation existe
        let conversation = await Conversation.findOne({
          participants: { $all: [currentUserId, recipientId] }
        });

        if (!conversation) {
          conversation = new Conversation({ participants: [currentUserId, recipientId] });
          await conversation.save();
        }

        // Créer et sauvegarder le message
        const message = new Message({
          conversation: conversation._id,
          sender: currentUserId,
          text,
        });

        await message.save();

        // Mettre à jour la conversation
        conversation.lastMessage = message._id;
        await conversation.save();

        // Envoyer le message en temps réel
        if (users[recipientId]) {
          users[recipientId].send(JSON.stringify({
            type: 'private_message',
            sender: currentUserId,
            text,
            conversationId: conversation._id
          }));
        }
      }
    });

    ws.on('close', () => {
      if (currentUserId) {
        delete users[currentUserId];
      }
    });
  });
};
