const Alert = require("../models/AlertModel");

const alertController = {
    createAlert: async (req, res) => {
     try {
        const newAlert = new Alert(req.body);
        const savedAlert = await newAlert.save();
        res.status(201).json(savedAlert);
     }  catch(error){
         res.status(500).json({ error: `Erreur serveur lors de la creation de l'alerte ${error.message}` });
     }
    },
    //get all alerts
    getAllAlerts: async (req, res) => {
        try {
            const alerts = await Alert.find();
            res.status(200).json(alerts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getAlertById: async (req, res) => {
        try {
            const alert = await Alert.findById(req.params.id);
            if (!alert) return res.status(404).json({ message: 'Alert not found' });
            res.status(200).json(alert);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    resolveAlert: async (req, res) => {
        try {
            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.id,
                { treated: true },
                { new: true }
            );
            if (!updatedAlert) return res.status(404).json({ message: 'Alert not found' });
            res.status(200).json(updatedAlert);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = alertController;