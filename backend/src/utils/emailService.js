const nodemailer = require('nodemailer');
require('dotenv').config();

// Confugurar el transportador de correo reutilizable
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT == 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un correo electrónico automatizado con las credenciales institucionales.
 * 
 * @param {string} destinatario - Correo del usuario registrado
 * @param {string} nombreCompleto - Nombre y Apellido del usuario
 * @param {string} codigo - Código institucional generado (Ej: P2677660)
 * @param {string} passwordTemporal - Contraseña inicial autogenerada
 */
async function enviarCorreoCredenciales(destinatario, nombreCompleto, codigo, passwordTemporal) {
    const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1a365d 0%, #2a4365 100%); color: white; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px;">Bienvenido a SimulatorSchool</h1>
                <p style="margin: 4px 0 0 0; color: #90cdf4; font-size: 14px;">Plataforma de Gestión Educativa</p>
            </div>
            <div style="padding: 24px; color: #2d3748; line-height: 1.6;">
                <p>Estimado(a) <strong>${nombreCompleto}</strong>,</p>
                <p>Su registro en el sistema se ha completado con éxito. A continuación, se detallan sus credenciales oficiales para ingresar a la aplicación de escritorio:</p>
                
                <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 16px; margin: 20px 0; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0;"><strong>Código Institucional:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 14px;">${codigo}</code></p>
                    <p style="margin: 0;"><strong>Contraseña Temporal:</strong> <code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 14px;">${passwordTemporal}</code></p>
                </div>

                <p style="font-size: 13px; color: #718096; background-color: #fffaf0; border: 1px solid #feebc8; padding: 12px; border-radius: 4px;">
                    ⚠️ <strong>Nota de Seguridad:</strong> Por políticas institucionales, se le solicitará cambiar esta contraseña temporal la primera vez que inicie sesión en el aplicativo.
                </p>
            </div>
            <div style="background-color: #f7fafc; padding: 16px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0;">
                Este es un correo automático generado por SimulatorSchool ERP. Por favor, no responda a este mensaje.
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Sistemas SimulatorSchool" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: 'Sus Credenciales de Acceso - SimulatorSchool',
            html: htmlTemplate
        });
        console.log(`Correo de credenciales enviado con éxito a: ${destinatario}`);
    } catch (error) {
        // En entornos reales, un error en el correo no debe tumbar la base de datos, 
        // solo se registra en logs o se encola para reintento.
        console.error(`Error al enviar el correo a ${destinatario}:`, error.message);
    }
}

module.exports = {
    enviarCorreoCredenciales
};