const Forum = require("../models/forumModel");
const Thematique = require("../models/thematiqueModel");
const Message = require("../models/messageModel");


const forumController = {
    createForum: async (req, res) => {
        try {
            const { titre, thematique, zone_geographique } = req.body;

            if (!titre || !thematique || !zone_geographique) {
                return res.status(400).json({ error: 'Tous les champs sont requis' });
            }

            const thematiqueExists = await Thematique.findById(thematique);
            if (!thematiqueExists) {
                return res.status(400).json({ error: 'Thématique non valide' });
            }


            const newForum = new Forum({
                titre,
                thematique,
                zone_geographique,
            });
console.log("new forum", newForum);
            const savedForum = await newForum.save();
            res.status(201).json(savedForum);
        } catch (error) {
            console.error("Error creating forum:", error);
            res.status(500).json({ error: 'Erreur serveur lors de la création du forum' });
        }
    },

    getAllForums: async (req, res) => {
        try {
            const forums = await Forum.find().populate('thematique', 'titre');
            res.json(forums);
        } catch (error) {
            console.error("Error getting all forums:", error);
            res.status(500).json({ error: 'Erreur serveur lors du chargement des forums' });
        }
    },

    getForumById: async (req, res) => {
        try {
            const forum = await Forum.findById(req.params.forumId).populate('thematique', 'titre');
            if (!forum) {
                return res.status(404).json({ message: "Forum not found" });
            }
            res.status(200).json(forum);
        } catch (error) {
            console.error("Error fetching Forum:", error);
            res.status(500).json({ message: "Error fetching Forum" });
        }
    },
    deleteForum: async (req, res) => { // Corrected deleteForum method
        try {
            const { id } = req.params; // Use req.params.id to get the forum ID
            const forum = await Forum.findById(id);
            if (!forum) {
                return res.status(404).json({ error: 'Forum non trouvé' });
            }
            await Forum.findByIdAndDelete(id); // Correctly delete the forum
            res.status(204).json({ message: 'Forum supprimé avec succès' });

        } catch (error) {
            console.error("Error deleting forum:", error)
            res.status(500).json({ error: 'Erreur lors de la suppression du Forum' });
        }
    },
    postMessage: async (req, res) => {
        try {
            const { forumId } = req.params;
            const { text } = req.body;
            const userId = req.user.id; // Assuming you have authentication middleware that sets req.user

            // Validation
            if (!forumId || !text) {
                return res.status(400).json({ error: 'Forum ID and message text are required' });
            }

            // Find the forum
            const forum = await Forum.findById(forumId);
            if (!forum) {
                return res.status(404).json({ error: 'Forum not found' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create the new message
            const newMessage = new Message({
                forum: forumId,
                user: userId, // Associate the message with the user
                text,
            });

            // Save the message
            const savedMessage = await newMessage.save();


            // Update the forum's lastMessage (optional, but useful)
            forum.lastMessage = savedMessage._id;
            await forum.save();

            // Populate the user information in the saved message (optional, but recommended)
            const populatedMessage = await Message.findById(savedMessage._id).populate("user", "nom prenom image"); // Adjust fields as needed



            res.status(201).json(populatedMessage);
        } catch (error) {
            console.error("Error posting message:", error);
            res.status(500).json({ error: 'Erreur serveur lors de l\'envoi du message' });
        }
    },
    getForumMessages: async (req, res) => {
      try {
          const {forumId} = req.params;
          if(!forumId){
              return res.status(400).json({error: 'Id Forum obligatoire'});
          }
          const forum = await Forum.findById(forumId);
          if(!forum){
              return res.status(404).json({error: 'Forum non trouvé'});
          }
          const messages = await Message.find({forum: forumId, conversation: null});
          res.json(messages);
      }  catch (error){
          console.error("Error getting forum messages:", error);
          return res.status(500).json({error: 'Erreur serveur lors du chargement des messages'});
      }
    },
};

module.exports = forumController;