import nodemailer from 'nodemailer';
// importar y configurar dotenv para las variables de entorno
import dotenv from 'dotenv';
dotenv.config();

// creando el objeto transporter, que basicamente contiene el servicio de correo electronico a usar
// y el correo desde el cual se enviaran los mails
const createTransporter = (email, password) => {
    return nodemailer.createTransport({
        host: 'flextrainer.com.ar',
        port: 465,
        secure: true,
        auth: {
            user: email,
            pass: password,
        },
        tls: {
            rejectUnauthorized: false
        }
    })
};

// funcion para enviar los emails
// destinatarios son quienes van a recibir el mail, ejemplo: un usuario al registrarse
// asunto y contenido son los datos del correo
// email es el email del remitente
// password es el pasword del email remitente
async function enviarCorreo(destinatario, asunto, contenido, email, password) {
    try {
        const transporter = createTransporter(email, password);
        console.log("transporter creado: ", transporter)

        const info = await transporter.sendMail({
            from: `FLEXTRAINER ${email}`,
            to: destinatario,
            subject: asunto,
            text: contenido,
        });

        console.log('Correo enviado:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo: ', error);
        return false;
    }
}

export { enviarCorreo }
