const express = require('express');
const cors = require('cors');
const db = require('./config/db'); // Importamos nuestro pool de base de datos
const matriculaRouters = require('./routes/matriculaRoutes')

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(cors());
app.use(express.json()); // Permite al servidor entender formatos JSON en las peticiones
app.use('/api/matriculas', matriculaRouters);

// Ruta de prueba de salud de la API (Healt Cheack)
app.get('/api/status', async (req, res) => {
    try {
        // Hacemos una consulta rapida de prueba a la BD
        const [rows] = await db.query('SELECT COUNT(*) as total_roles FROM roles');

        res.json({
            status: "online",
            database: "conectada",
            message: "Servidor de SimulatorSchool operando correctamente",
            roles_configurados: rows[0].total_roles,
            timestamp: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: "offline",
            database: "desconectada",
            message: "Error al conectar a la base de datos",
            timestamp: new Date(),
            error: error.message
        });
    }
});

// Inicializacion del Servidor
app.listen(PORT, () => {
    console.log(`===============================================================`);
    console.log(`SimulatorSchool Backend API Server Running on Port ${PORT}`);
    console.log(`ENVIRONMENT: Desarrollo`);
    console.log(`===============================================================`);
})