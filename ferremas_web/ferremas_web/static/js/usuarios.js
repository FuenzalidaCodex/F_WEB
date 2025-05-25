import { API_URL } from "./config.js";


document.addEventListener('DOMContentLoaded', () => {
    const tablaBody = document.querySelector('#tabla-usuarios tbody');

    // URL correcta para la API de usuarios
    const urlAPI = `${API_URL}/api/usuarios/`;

    fetch(urlAPI)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                tablaBody.innerHTML = '<tr><td colspan="6">No hay usuarios para mostrar.</td></tr>';
                return;
            }

            tablaBody.innerHTML = '';

            data.forEach(usuario => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.username}</td>
                    <td>${usuario.tipo_usuario}</td>
                    <td>${usuario.is_active ? 'Sí' : 'No'}</td>
                    <td>${usuario.is_staff ? 'Sí' : 'No'}</td>
                `;
                tablaBody.appendChild(fila);
            });
        })
        .catch(error => {
            tablaBody.innerHTML = `<tr><td colspan="6">Error: ${error.message}</td></tr>`;
            console.error(error);
        });
});


