const Conversation = require("../models/conversationModel");
const Users = require("../models/userModel");
const Commentaire = require('../models/commentaireModel');

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await Users.find();

      const userPayload = users.map((user) => ({
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        image: user.image,
      }));

      res.json(userPayload);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erreur lors de la récupération des users depuis la base de données");
    }
  },
  getUserConversations: async (req, res) => {
    try {
      const conversations = await Conversation.find({ participants: req.params.userId }).populate("participants", "nom prenom image").populate("lastMessage");
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement des conversations" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId);
      if (!user) {
        res.status(400).send("Utilisateur introuvable");
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement de l'utilisateur" });
    }
  },
  updateUserById: async (req, res) => {
    try {
      console.log("Received FormData:", req.body);
      console.log("Received File:", req.file);

      const user = await Users.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      Object.assign(user, req.body);

      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  addReviewToUser: async (req, res) => {
    try {
      const userId = req.params.userId;
      const { reviewerId, rating, comment } = req.body;

      console.log("reviewData:", JSON.stringify({ reviewerId, rating, comment }));

      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Créer un nouveau commentaire
      const newComment = new Commentaire({
        reviewerId,
        rating,
        comment,
      });

      // Sauvegarder le commentaire
      const savedComment = await newComment.save();

      // Ajouter l’ID du commentaire au tableau commentaires de l’utilisateur
      user.commentaires.push(savedComment._id);
      await user.save();

      const updatedUser = await Users.findById(userId).populate({
        path: 'commentaires',
        populate: { path: 'reviewerId', select: 'nom prenom' },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de l’ajout de l’avis:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
  getReviews: async (req, res) => {
    try {
      const userId = req.params.userId;
  
      console.log("Récupération des avis pour l'utilisateur:", userId);
  
      // Trouver l’utilisateur et peupler les commentaires
      const user = await Users.findById(userId).populate({
        path: 'commentaires',
        populate: { path: 'reviewerId', select: 'nom prenom' }, // Inclure nom et prénom du reviewer
      });
  
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
  
      console.log("Commentaires trouvés:", JSON.stringify(user.commentaires));
      res.json(user.commentaires);
    } catch (error) {
      console.error("Erreur lors de la récupération des avis:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
};

module.exports = usersController;
