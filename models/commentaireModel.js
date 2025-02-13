const mongoose = require('mongoose');

const CommentaireSchema = new mongoose.Schema({
  auteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destinataireId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  note: {
    type: Number,
    min: 0,
    max: 10,
    set: v => parseFloat(v.toFixed(1)),
    get: v => parseFloat(v.toFixed(1)),
  },
  texte: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Commentaire', CommentaireSchema);
