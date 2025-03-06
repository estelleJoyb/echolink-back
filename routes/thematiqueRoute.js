const express = require('express');
const thematiqueController = require('../controllers/thematiqueController');
const router = express.Router();

router.get('/', thematiqueController.getAllThematique);

router.get('/:id', thematiqueController.getThematiqueByID);

router.post('/', thematiqueController.createThematique);

router.delete( '/:id', thematiqueController.deleteThematique);

router.put('/:id', thematiqueController.updateThematique);

module.exports = router;