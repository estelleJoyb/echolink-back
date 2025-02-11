const mongoose = require('mongoose');

const ThematiqueSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Thematique', ThematiqueSchema);