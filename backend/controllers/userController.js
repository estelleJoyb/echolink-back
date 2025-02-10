const Conversation = require("../models/ConversationModel");
const { Users } = require("../models/usersModel");

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
  getUserConversion: async (req, res) => {
    try {
      const conversations = await Conversation.find({ participants: req.params.userId }).populate("participants", "nom prenom image").populate("lastMessage");
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors du chargement des conversations" });
    }
  },
};

module.exports = usersController;
