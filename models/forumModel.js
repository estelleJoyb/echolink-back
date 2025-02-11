const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
    },
    thematique: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    zone_geographique: {
        type: String,
        required: true,
    },
    lastMessage: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Forum', ForumSchema);