import { API_URL } from "./config.js";

let productosCache = [];

async function cargarProductos(filtro = '') {
    try {
        if (productosCache.length === 0) {
            const respuesta = await fetch(`${API_URL}/api/productos/`);
            productosCache = await respuesta.json();
        }

        // Ordenar según la fecha (más reciente primero)
        productosCache.sort((a, b) => {
            const fechaA = new Date(a.fecha_actualizacion_precio || a.fecha_actualizacion || a.fecha_creacion);
            const fechaB = new Date(b.fecha_actualizacion_precio || b.fecha_actualizacion || b.fecha_creacion);
            return fechaB - fechaA;
        });

        const contenedor = document.getElementById('productos');
        const mensajeBusqueda = document.getElementById('mensajeBusqueda');

        filtro = filtro.trim();

        if (filtro === '') {
            mensajeBusqueda.textContent = '';
            mostrarProductos(productosCache, contenedor);
            return;
        }

        const productosFiltrados = productosCache.filter(p => {
            return p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(filtro.toLowerCase()));
        });

        if (productosFiltrados.length === 0) {
            mensajeBusqueda.textContent = `No se encontraron productos para "${filtro}"`;
            mostrarProductos(productosCache, contenedor);
            setTimeout(() => {
                mensajeBusqueda.textContent = '';
            }, 5000);
        } else {
            mensajeBusqueda.textContent = '';
            mostrarProductos(productosFiltrados, contenedor);
        }

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos, contenedor) {
    contenedor.innerHTML = ''; // limpiar contenedor
    productos.forEach(p => {
        const fecha = p.fecha_actualizacion_precio || p.fecha_actualizacion || p.fecha_creacion || '';
        const fechaFormateada = fecha ? new Date(fecha).toLocaleDateString('es-CL') : 'N/A';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${p.imagen || 'https://via.placeholder.com/70'}" alt="${p.nombre}" width="70" height="70" style="object-fit: cover; border-radius: 5px;"></td>
            <td>${p.nombre}</td>
            <td>${p.descripcion || 'Sin descripción.'}</td>
            <td>$${p.precio}</td>
            <td>${p.stock}</td>
            <td>${fechaFormateada}</td>
            <td>
                <a href="/detalle/?id=${p.id_producto}" class="btn btn-sm btn-primary">
                    <i class="bi bi-eye"></i> Ver
                </a>
            </td>
        `;
        contenedor.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    const form = document.getElementById('formBusqueda');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const filtro = document.getElementById('inputBusqueda').value;
        cargarProductos(filtro);
    });
});

// Manejo de sesión idéntico al otro JS:
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const nombreUsuario = document.getElementById('nombreUsuario');
    const loginLinks = document.getElementById('loginLinks');
    const logoutLink = document.getElementById('logoutLink');
    const empleadoMenu = document.getElementById('empleadoMenu');

    if (usuario) {
        nombreUsuario.textContent = usuario.username;
        loginLinks.style.display = 'none';
        logoutLink.style.display = 'block';

        if (usuario.tipo_usuario !== 'cliente') {
            empleadoMenu.style.display = 'block';
        }
    } else {
        nombreUsuario.textContent = '¡Inicia tu sesión Ferremas!';
        loginLinks.style.display = 'block';
        logoutLink.style.display = 'none';
        empleadoMenu.style.display = 'none';
    }
});

function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.reload();
}
