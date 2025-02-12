const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  forum: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Forum',
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
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

}, { timestamps: true });

messageSchema.path('forum').validate(function(value) {
  return (value || this.conversation);
}, 'Either forum or conversation must be defined.');

module.exports = mongoose.model('Message', messageSchema);