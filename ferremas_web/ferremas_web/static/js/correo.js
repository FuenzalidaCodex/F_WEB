
export async function enviarCorreo(nombre, email) {
    try {
        
        emailjs.init(''); 
        
        const result = await emailjs.send('', '', {
            nombre: nombre,
            email: email
        });
        console.log('Correo enviado:', result.status);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}