const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const socketService = require("../services/socketService");

const conversationController = {
  createConversation: async (req, res) => {
    try {
      const { name, recipient, sender } = req.body;

      let conversation = await Conversation.findOne({
        participants: { $all: [sender, recipient] },
      });

      if (!conversation) {
        conversation = new Conversation({
          name,
          participants: [sender, recipient],
          createdBy: sender,
        });
        await conversation.save();
      }

      const populatedConversation = await Conversation.findById(conversation._id).populate("participants", "nom prenom image").populate("lastMessage");

      // Join both participants to the conversation room
      conversation.participants.forEach((participantId) => {
        socketService.joinConversation(participantId.toString(), conversation._id.toString());
      });

      // Notify all participants about the new conversation
      socketService.sendToUsers(
          conversation.participants.map((p) => p.toString()),
          "new_conversation",
          populatedConversation
      );

      res.status(201).json(populatedConversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Error creating conversation" });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const conversationId = req.params.conversationId;
      const { user, text } = req.body;

      let conversation = await Conversation.findById(conversationId).populate("participants", "_id");

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const message = new Message({
        conversation: conversationId,
        user,
        text,
        date: Date.now(),
      });

      await message.save();

      // Update conversation's lastMessage
      conversation.lastMessage = message._id;
      await conversation.save();

      // Populate the message with sender details
      const populatedMessage = await Message.findById(message._id)

      // Get socket instance
      const io = socketService.getIO();

      // Emit to all participants in the conversation
      conversation.participants.forEach((participant) => {
        if(participant._id !== user){
          io.to(participant._id.toString()).emit("new_message", {
            conversationId,
            message: populatedMessage,
          });
        }
      });

      console.log("Message sent and broadcasted:", {
        conversationId,
        messageId: message._id,
        recipients: conversation.participants.map((p) => p._id),
      });

      res.status(201).json(populatedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Error sending message: " + error.message });
    }
  },

  getConversationById: async (req, res) => {
    try {
      const conversation = await Conversation.findById(req.params.conversationId);

      if (!conversation) {
        res.status(400).send("Conversation introuvable");
      }

      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement de la conversation" + error });
    }
  },

  getMessagesByConversationId: async (req, res) => {
    try {
      const messages = await Message.find({ conversation: req.params.conversationId });

      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement des messages" + error });
    }
  },
};

module.exports = conversationController;