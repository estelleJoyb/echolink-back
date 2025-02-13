const Conversation = require("../models/conversationModel");
const Users = require("../models/userModel");
const fs = require('fs');
const path = require('path');
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
      const userId = req.params.userId;
      const user = await Users.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      Object.assign(user, req.body);

      if (req.file) {
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir);
        }

        const filename = `${userId}.png`;
        const filePath = path.join(uploadsDir, filename);
        if(fs.existsSync(filePath)){
          //delete old file image
          fs.unlinkSync(filePath);
        }
        fs.writeFileSync(filePath, req.file.buffer);
        user.image = `/uploads/${filename}`;
      }

      await user.save();
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = usersController;
