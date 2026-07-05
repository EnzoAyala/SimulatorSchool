const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { generarCodigoInstitucional } = require('../utils/codeGenerator');

exports.registrarUsuario = async (req, res) => {
    // 1. Desestructurar los datos que vienen del cliente 9Angular)
    const { dni, nombre, apellido, correo, nombreRol, ...datosPerfil } = req.body;

    // Obtener una conexion exclusiva del poll para manejar transacciones
    const connection = await db.getConnection();

    try {
        // Iniciar transaccion (Estandar para evitar datos huerfanos en tablas relacionadas)
        await connection.beginTransaction();

        // 2. Verificar el ID del rol ingresado
        const [roles] = await connection.query('SELECT id FROM roles WHERE nombre = ?', [nombreRol.toUpperCase()]);
        if (roles.length === 0) {
            return res.status(400).json({ message: `El rol '${nombreRol} no es valido en el sistema.` });
        }
        const rolId = roles[0].id;

        // 3. Generar el codigo Institucional con tu regla de negocio
        const anioActual = new Date().getFullYear();
        const condigoInst = generarCodigoInstitucional(nombreRol, anioActual, dni);

        // 4. Generar contraseña temporar aleatoria y encriptarla
        const passwordTemporal = `init_${dni.substring(0, 4)}`; // Contraseña inicial basada en DNI
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordTemporal, salt);

        // 5. Insertar en la tabla maestra 'usuarios'
        const queryUsuario = `
            INSERT INTO usuarios (codigo_institucional, dni, nombre, apellido, correo, password_hash, rol_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [resUsuario] = await connection.query(queryUsuario, [
            codigoInst, dni, nombre, apellido, correo, passwordHash, rolId
        ]);

        const nuevoUsuarioId = resUsuario.insertId;

        // 6. Insercion especializada segun el perfil (1:1)
        if (nombreRol.toUpperCase() === "ALUMNO"){
            const queryAlumno = `INSERT INTO alumnnos (usuario_id, anio_matricula) VALUES (?, ?)`;
            await connection.query(queryAlumno, [nuevoUsuarioId, anioActual]);
        }
        else if (nombreRol.toUpperCase() === 'PROFESOR') {
            // Aseguramos que vengas los datos obligatorios para el docente
            const especialidad = datosPerfil.especialidad || 'General';
            const salario = datosPerfil.salario || 0.00;

            const queryProfesor = `INSERT INTO profesores (usuario_id, especialidad, salario) VALUES (?, ?, ?)`;
            await connection.query(queryProfesor, [nuevoUsuarioId, especialidad, salario]);
        }

        //  Si todo salio bien, consolidar cambios en la BD
        await connection.commit();

        // aquí se llamaría al servicio de NodeMailer 
        // para disparar el correo electrónico con las 
        // credenciales en segundo plano.

        res.status(201).json({
            status: "success",
            message: "Usuario matriculado y registrado exitosamente en el sistema",
            data: {
                codigo_institucional: condigoInst,
                usuario: `${nombre} ${apellido}`,
                corre_asignado: correo,
                credenciales_temporales: {
                    usuario_acceso: codigoInst,
                    password_inicial: passwordTemporal
                }
            }
        });

    } catch (error) {
        // Si hay algun error, deshacer todos los cambios
        await connection.rollback();
        console.error("Error en el proceso de matricula: ", error);
        res.status(500).json({
            status: "error",
            messaje: "No se pudo comletar eel registro debido a un conflicto de datos. ",
            error: error.message
        });
    } finally {
        // Siempre liberar la conecion de vuelta al pool 
        connection.release();
    }
};