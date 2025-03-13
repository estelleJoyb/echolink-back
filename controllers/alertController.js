const Alert = require("../models/AlertModel");
const socketService = require('../services/socketService');

const alertController = {
    createAlert: async (req, res) => {
     try {
        const newAlert = new Alert(req.body);
        const savedAlert = await newAlert.save();

         // Get socket instance
         const io = socketService.getIO();

         //emit the alert to all connected users
         socketService.connectedUsers.forEach((socketId, userId) => {
             io.to(userId).emit('new_alert', savedAlert);
         });

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
            const alert = await Alert.findById(req.params.alertId);
            if (!alert) return res.status(404).json({ message: 'Alert not found' });
            res.status(200).json(alert);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    resolveAlert: async (req, res) => {
        try {
            const updatedAlert = await Alert.findByIdAndUpdate(
                req.params.alertId,
                { treated: true },
                { new: true }
            );
            if (!updatedAlert) return res.status(404).json({ message: 'Alert not found' });

            // Get socket instance
            const io = socketService.getIO();

            //emit the alert to all connected users
            socketService.connectedUsers.forEach((socketId, userId) => {
                io.to(userId).emit('alert_resolved', updatedAlert);
            });

            res.status(200).json(updatedAlert);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    
    // New method to get nearby alerts
    getNearbyAlerts: async (req, res) => {
        try {
            const { coords, distance } = req.params;
            const [lat, lng] = coords.split(';').map(Number);
            const maxDistance = parseInt(distance) || 10000; // Default 10km if not specified
            
            if (isNaN(lat) || isNaN(lng)) {
                return res.status(400).json({ message: 'Invalid coordinates format' });
            }
            
            // Find all alerts
            const allAlerts = await Alert.find({ treated: false });
            
            // Filter alerts by distance manually since we're storing coords as a string
            const nearbyAlerts = allAlerts.filter(alert => {
                const [alertLat, alertLng] = alert.zone_geographique.split(';').map(Number);
                if (isNaN(alertLat) || isNaN(alertLng)) return false;
                
                // Calculate distance in meters using the Haversine formula
                const R = 6371000; // Earth radius in meters
                const φ1 = lat * Math.PI/180;
                const φ2 = alertLat * Math.PI/180;
                const Δφ = (alertLat-lat) * Math.PI/180;
                const Δλ = (alertLng-lng) * Math.PI/180;
                
                const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                          Math.cos(φ1) * Math.cos(φ2) *
                          Math.sin(Δλ/2) * Math.sin(Δλ/2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                const distance = R * c;
                
                return distance <= maxDistance;
            });
            
            res.status(200).json(nearbyAlerts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = alertController;