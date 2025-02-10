const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');

module.exports = function(wss) {
  const users = new Map();

  wss.on('connection', (ws) => {
    let userId = null;

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'connect':
            userId = data.userId;
            users.set(userId, ws);
            console.log(`User ${userId} connected`);
            break;

          case 'new_conversation':
            const { sender, recipient, conversation } = data;
            
            // Notify recipient about new conversation
            if (users.has(recipient)) {
              users.get(recipient).send(JSON.stringify({
                type: 'new_conversation',
                conversation
              }));
            }
            break;

          case 'private_message':
            const { text } = data;
            const message = new Message({
              conversation: data.conversation,
              sender: data.sender,
              text,
              createdAt: new Date()
            });
            
            await message.save();

            // Update conversation's last message
            await Conversation.findByIdAndUpdate(
              data.conversation,
              { 
                lastMessage: message._id,
                updatedAt: new Date()
              }
            );

            const populatedMessage = await Message.findById(message._id)
              .populate('sender', 'nom prenom image');

            // Send to recipient
            if (users.has(data.recipient)) {
              users.get(data.recipient).send(JSON.stringify({
                type: 'private_message',
                message: populatedMessage
              }));
            }

            // Send confirmation to sender
            ws.send(JSON.stringify({
              type: 'message_sent',
              message: populatedMessage
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket error:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'An error occurred' 
        }));
      }
    });

    ws.on('close', () => {
      if (userId) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};