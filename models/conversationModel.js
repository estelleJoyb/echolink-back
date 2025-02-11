const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);