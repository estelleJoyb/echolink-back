const express = require('express');
const thematiqueController = require('../controllers/thematiqueController');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
router.use(auth); //apply auth to all forum routes
router.get('/thematique', thematiqueController.getAllThematique);
router.post('/thematique', thematiqueController.createThematique);
router.delete( '/thematique/:id', thematiqueController.deleteThematique);
router.put('/thematique/:id', thematiqueController.updateThematique);

module.exports = router;