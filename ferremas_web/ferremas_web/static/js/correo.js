
export async function enviarCorreo(nombre, email) {
    try {
        
        emailjs.init('bEaPqcZo8Umf-Wz0T'); 
        
        const result = await emailjs.send('service_4amfijq300903', 'template_p9qam3n300903', {
            nombre: nombre,
            email: email
        });
        console.log('Correo enviado:', result.status);
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw error;
    }
}