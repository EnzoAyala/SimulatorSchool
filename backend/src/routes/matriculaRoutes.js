const express = require('express');
const router = express.Router();
const matriculaController = require('../controllers/matriculaController');

// Ruta para matricular/ registrar un nuevo usuario (Alumno o Profesor)
router.post('/registrar', matriculaController.registrarUsuario);

module.exports = router;