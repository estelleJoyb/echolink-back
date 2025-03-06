const Thematique = require("../models/thematiqueModel");


const thematiqueController = {
    getAllThematique: async (req, res) => {
        try {
            const thematiques = await Thematique.find();
            res.json(thematiques);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du chargement des thematiques' });
        }
    },
    getThematiqueByID: async (req, res) => {
        try {
            const id = req.params.id;
            const thematique = await Thematique.findById(thematiques);
            if(!thematique){
                return res.status(404).json({error: 'Thematique non trouvée'});
            }
            res.json(thematique);
        } catch (error) {
            res.status(500).json({ error: 'Erreur lors du chargement de la thématique' });
        }
    },
    createThematique: async (req, res) => {
        try {
            const {titre} = req.body;
            if(!titre){
                return res.status(400).json({error: 'Le titre est requis'});
                }
            const newThematique = new Thematique({
                titre
            });
            const savedThematique = await newThematique.save();
            res.status(201).json(savedThematique);
        }catch (error){
            res.status(500).json({ error: 'Erreur lors de la création de la thematique' });
        }
    },
    deleteThematique: async (req, res) => {
        try {
            const {id} = req.params.id;
            const thematique = await Thematique.findById(id);
            if(!thematique){
                return res.status(404).json({error: 'Thematique non trouvée'});
            }
            await Thematique.findByIdAndDelete(id);
            res.status(204).json({message: 'Thematique supprimée avec succès'});
        }catch (error){
            res.status(500).json({ error: 'Erreur lors de la suppression de la thematique' });
        }
    },
    updateThematique: async (req, res) => {
        try {
            const { id } = req.params;
            const { titre } = req.body;

            const thematique = await Thematique.findById(id);
            if (!thematique) {
                return res.status(404).json({ error: 'Thématique non trouvée' });
            }

            if (!titre) {
                return res.status(400).json({ error: "Le titre est requis"});
            }

            thematique.titre = titre;
            await thematique.save();

            res.json(thematique);
        } catch (error) {
            console.error("Error updating thematique:", error);
            res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de la thématique' });
        }
    },
};

module.exports = thematiqueController;
