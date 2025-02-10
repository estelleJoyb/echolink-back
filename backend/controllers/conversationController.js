const Conversation = require("../models/ConversationModel");
const Message = require("../models/MessageModel");


const conversationController = {
  sendMessage: async (req, res) => {
    try {
      const { sender, recipient, text } = req.body;
  
      let conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] }
      });
  
      if (!conversation) {
        conversation = new Conversation({ participants: [sender, recipient] });
        await conversation.save();
      }
  
      const message = new Message({
        conversation: conversation._id,
        sender,
        text
      });
  
      await message.save();
  
      conversation.lastMessage = message._id;
      await conversation.save();
  
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
    }
  },
  getConversationById: async (req, res) => {
    try {
      const messages = await Message.find({ conversation: req.params.conversationId })
        .populate('sender', 'nom prenom image');
  
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors du chargement des messages' });
    }
  }
};

module.exports = conversationController;
