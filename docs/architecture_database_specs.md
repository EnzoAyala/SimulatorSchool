# Technical Design Document (TDD) - SimulatorSchool

## Especificación del Sistema de Identidad Estudiantil y Laboral

Para mitigar riesgos de seguridad y simular de manera idéntica un entorno corporativo, el sistema no expondrá los IDs secuenciales de la base de datos (`usuarios.id`) en las interfaces de usuario. En su lugar, se implementa un **Código Institucional Único Autogenerado**.

### Regla de Generación del Código (`codigo_institucional`)
El backend procesará los datos en el momento del registro (Módulo Matrículas) aplicando la siguiente nomenclatura algorítmica:
* **Posición 1 (Prefijo de Rol):** 
  * `A` = Alumno
  * `P` = Profesor
  * `X` = Admin / Personal Administrativo
  * `S` = Soporte / Reclamos
  * `M` = Personal de Matrículas
* **Posición 2-3 (Año de Inscripción):** Dos últimos dígitos del año lectivo actual (Ejemplo: 2026 -> `26`).
* **Posición 4-8 (Segmento DNI):** Los primeros 5 dígitos del Documento Nacional de Identidad del usuario registrado.

**Ejemplo de caso de uso real:**
* **Tipo de registro:** Profesor
* **Año actual:** 2026
* **DNI del docente:** 77660123
* **Resultado generado:** `P2677660`

### Flujo de Datos en Base de Datos
1. Las credenciales de acceso unificadas residen en `usuarios`.
2. Las tablas `alumnos` y `profesores` actúan como extensiones de atributos específicos mediante relaciones de integridad referencial 1:1 (`ON DELETE CASCADE`).