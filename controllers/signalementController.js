const Signalement = require("../models/signalementModel");

const signalementController = {
    getSignalementById: async (req, res) => {
        try {
            const signalement = await Signalement.find({ signalement: req.params.signalement })
                .populate('sender', 'nom prenom image');
            if(!signalement){
                return res.status(404).json({ error: 'Signalement non trouvé' });
            }
            res.json(messages);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du chargement des signalements' });
        }
    },
    createSignalement: async (req, res) => {
        try {
            const { lieu, latitude, longitude, description, priorite, user, status, date } = req.body;
            const signalement = new Signalement({ lieu, latitude, longitude, description, priorite, user, status, date });
            await signalement.save();
            res.status(201).json(signalement);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la création du signalement' });
        }
    },
    getAllSignalements: async (req, res) => {
        try {
            const signalements = await Signalement.find().populate('user', 'nom prenom image');
            res.json(signalements);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors de la récupération des signalements' });
        }
    }
};

module.exports = signalementController;
