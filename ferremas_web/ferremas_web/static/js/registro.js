import { API_URL } from "./config.js";
import { API_URL1 } from "./config.js";
import { enviarCorreo } from './correo.js';

// Registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = e.target.username.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        const passwordConfirm = e.target.passwordConfirm.value.trim();
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.textContent = '';
        mensajeDiv.style.color = '';

        if (!username || !email || !password || !passwordConfirm) {
            mensajeDiv.textContent = 'Por favor, completa todos los campos.';
            mensajeDiv.style.color = 'red';
            return;
        }

        if (password !== passwordConfirm) {
            mensajeDiv.textContent = 'Las contraseñas no coinciden.';
            mensajeDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/usuarios/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            if (response.ok) {
                mensajeDiv.style.color = 'green';
                mensajeDiv.textContent = '¡Registro exitoso! Redirigiendo al inicio de sesión...';

                await enviarCorreo(username, email);

                setTimeout(() => {
                    window.location.href = `${API_URL1}/usuario/inicio_sesion/`;
                }, 1500);
            } else {
                const errorData = await response.json();
                mensajeDiv.style.color = 'red';
                mensajeDiv.textContent = 'Error: ' + JSON.stringify(errorData);
            }
        } catch (error) {
            mensajeDiv.style.color = 'red';
            mensajeDiv.textContent = 'Error al conectar con el servidor.';
            console.error('Error registro:', error);
        }
    });
}

// Inicio de sesión
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = e.target.email.value.trim();
        const password = e.target.password.value.trim();
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.textContent = '';

        if (!email || !password) {
            mensajeDiv.textContent = 'Por favor, completa ambos campos.';
            mensajeDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login: email, password: password })
            });

            if (response.ok) {
                const data = await response.json();
                mensajeDiv.style.color = 'green';
                mensajeDiv.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
                localStorage.setItem('usuario', JSON.stringify(data));
                setTimeout(() => { window.location.href = '/productos/'; }, 1500);
            } else {
                mensajeDiv.style.color = 'red';
                mensajeDiv.textContent = 'Usuario o contraseña incorrectos.';
            }
        } catch (error) {
            mensajeDiv.style.color = 'red';
            mensajeDiv.textContent = 'Error al conectar con el servidor.';
            console.error('Error al iniciar sesión:', error);
        }
    });
}

// Formulario de contacto
const formContacto = document.getElementById('formContacto');
if (formContacto) {
    formContacto.addEventListener('submit', async function (e) {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target).entries());

        try {
            const res = await fetch(`${API_URL}/api/contactos/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (res.ok) {
                alert('Mensaje enviado con éxito');
                e.target.reset();
            } else {
                alert('Error al enviar mensaje');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
}


