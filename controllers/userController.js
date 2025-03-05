const Conversation = require("../models/conversationModel");
const Users = require("../models/userModel");
const Commentaire = require('../models/commentaireModel');

const usersController = {
  getUsers: async (req, res) => {
    try {
      const users = await Users.find().select('-password');
      
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
      const conversations = await Conversation.find({ participants: req.params.userId })
        .populate({
          path: "participants",
          select: "nom prenom image",
        })
        .populate("lastMessage");
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement des conversations" });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await Users.findById(req.params.userId).select('-password');
      if (!user) {
        return res.status(404).send("Utilisateur introuvable");
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
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      Object.assign(user, req.body);

      if (req.file) {
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      await user.save();
      // Renvoyer l’utilisateur sans le password
      const updatedUser = await Users.findById(req.params.userId).select('-password');
      res.json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l’utilisateur:", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
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

      const newComment = new Commentaire({
        reviewerId,
        rating,
        comment,
      });

      const savedComment = await newComment.save();
      user.commentaires.push(savedComment._id);
      await user.save();

      const updatedUser = await Users.findById(userId)
        .select('-password')
        .populate({
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

      const user = await Users.findById(userId)
        .select('-password')
        .populate({
          path: 'commentaires',
          populate: { path: 'reviewerId', select: 'nom prenom' },
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