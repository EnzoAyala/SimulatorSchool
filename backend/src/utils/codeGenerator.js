/**
 * Genera el Codigo Institucional Unico para un usuario de SimulatorSchool.
 * Formato: [Letra Rol] [2 digitos Año de Inscripción] [5 digitos DNI] (ej: P2677660)
 * 
 * @param {string} nombreRol - Nombre del rol (ADMIN, PROFESOR, ALUMNO, SOPORTE, MATRICULA)
 * @param {string | number} anio - Año de Inscripción o registro
 * @param {string} dni - DNI del usuario
 * @returns {string} Codigo Institucional autogenerado
 */
function generarCodigoInstitucional(nombreRol, anio, dni){
    // 1. Obtener el prefijo segun el rol
    let prefijo = 'X'; // Por defecto para administradores o generales
    const rolUper = nombreRol.toUpperCase();

    if(rolUper === 'ALUMNO') prefijo = 'A';
    else if(rolUper === 'PROFESOR') prefijo = 'P';
    else if(rolUper === 'SOPORTE') prefijo = 'S';
    else if(rolUper === 'MATRICULA') prefijo = 'M';

    // 2. Extraer los ultimos 2 digitos del año (Ej: 2026 -> 26)
    const anioString = anio.toString();
    const ultimosDosAnio = anioString.substring(anioString.length - 2);


    // 3. Limpiar el DNI de espacios y extraer los primeros 5 digitos
    const dniLimpio = dni.toString().trim();
    const primerosCincoDni = dniLimpio.substring(0, 5);

    // 4. Concatenar y retornar el codigo institucional en mayusculas
    return `${prefijo}${ultimosDosAnio}${primerosCincoDni}`.toUpperCase();
}

module.exports = {
    generarCodigoInstitucional
};