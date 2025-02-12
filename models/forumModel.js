const mongoose = require('mongoose');

const ForumSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true,
        unique: true,
    },
    thematique: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Thematique',
    },
    zone_geographique: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Forum', ForumSchema);