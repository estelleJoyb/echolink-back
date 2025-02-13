const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tel: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  commentaires: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commentaire',
  }],
}, { timestamps: true, toJSON: { getters: true } });

module.exports = mongoose.model('User', UserSchema);