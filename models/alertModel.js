const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    criticity: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    zone_geographique: {
        type: String,
        required: true,
    },
    treated: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Alert', AlertSchema);