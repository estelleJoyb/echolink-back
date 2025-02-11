const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const { getIO } = require('../services/socketService'); // Importer la méthode getIO

const conversationController = {
  createConversation: async (req, res) => {
    try {
      const { name, sender, recipient } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] }
      });

      if (!conversation) {
        conversation = new Conversation({
          name,
          participants: [sender, recipient],
          createdBy: sender
        });
        await conversation.save();
      }

      // Populate the conversation with participant details
      const populatedConversation = await Conversation.findById(conversation._id)
        .populate('participants', 'nom prenom image')
        .populate('lastMessage');

      res.status(201).json(populatedConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Error creating conversation' });
    }
  },
  sendMessage: async (req, res) => {
    try {
      const { sender, recipient, text } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] },
      });

      if (!conversation) {
        conversation = new Conversation({ participants: [sender, recipient] });
        await conversation.save();
      }

      const message = new Message({
        conversation: conversation._id,
        sender,
        text,
      });

      await message.save();

      conversation.lastMessage = message._id;
      await conversation.save();

      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
  },
  getConversationById: async (req, res) => {
    try {
      const messages = await Message.find({ conversation: req.params.conversationId }).populate("sender", "nom prenom image");

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement des messages" });
    }
  },
  
};

module.exports = conversationController;
