-- ==================================================================
-- SCRIPT DE CREACIÓN DE BASE DE DATOS - SIMULATORSCHOOL
-- ==================================================================

CRATE DATABASE IF NOT EXISTS `simulator_school_db`;
USE simulator_school_db;

-- 1. Tabla de Roles 
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabla Maestra de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_institucional VARCHAR(20) NOT NULL UNIQUE, -- Ejem: P2677660, A2688990
    dni VARCHAR(9) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 3. Tabla Perfil: ALumnos (Relacion 1:1)
CREATE TABLE alumnos (
    usuario_id INT PRIMARY KEY,
    anio_matricula INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Tabla Perfil: profesores (Relacion 1:1)
CREATE TABLE profesores (
    usuario_id INT PRIMARY KEY,
    especialidad VARCHAR(100) NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
)

-- 5. Tabla de Gestión de Quejas e Incidencias (Módulo de Soporte)
CREATE TABLE reclamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emisor_id INT NOT NULL,
    responsable_id INT default NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    autualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (emisor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (responsable_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_estado CHECK (estado IN ('PENDIENTE', 'EN_REVISION', 'RESUELTO', 'ANULADO'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =======================================================================
-- DATA SEEDING (Roles Core)
-- =======================================================================

INSERT INTO roles (nombre) VALUES 
('ADMIN'),
('PROFESOR'),
('ALUMNO'),
('SOPORTE'),
('MATRICULA');