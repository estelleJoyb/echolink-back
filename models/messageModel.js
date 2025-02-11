const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
    required: true
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  text: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
  }

}, { timestamps: true });

messageSchema.path('forum').validate(function(value) {
  return (value || this.conversation);
}, 'Either forum or conversation must be defined.');

module.exports = mongoose.model('Message', messageSchema);