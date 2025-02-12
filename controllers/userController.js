const Conversation = require("../models/conversationModel");
const Users = require("../models/userModel");

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
      const usr = req.body;
      const user = await Users.findById(req.params.userId);
      if(!user){
        return res.status(404).json({error: 'Utilisateur non trouvé'});
      }
      if(usr.nom){
        user.nom = usr.nom;
      }
      if(usr.prenom){
        user.prenom = usr.prenom;
      }
      if(usr.email){
        user.email = usr.email;
      }
     if(usr.tel){
       user.tel = usr.tel;
     }
      if(usr.image){
        user.image = usr.image;
      }

      const updatedUser = await user.save();
      res.json(updatedUser);
    }catch (error){
      res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  }

};

module.exports = usersController;
