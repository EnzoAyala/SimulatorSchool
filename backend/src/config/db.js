const mysql = require('mysql2/promise'); // Usamos la ersion de promesas para usar async/await
require('dotenv').config();

// Cear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Maximo de conexiones simultáneas en el Pool
    queueLimit: 0
});


// Verificar la conexion al iniciar el servidor
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión exitosa a la base datos MySQL (Pool Activo ).');
        connection.release(); // Liberar la conexión para que vuelva al pool
    } catch (erros) {
        console.error('Error critico al conectara a la base de datos: ', error.message);
    }
}) ();

module.exports = pool;