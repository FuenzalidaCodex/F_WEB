
let productosCache = [];

async function cargarProductos(filtro = '') {
    try {
        // Si no hay cache o está vacío, hacemos fetch
        if (productosCache.length === 0) {
            const respuesta = await fetch('http://localhost:8000/api/productos/');
            productosCache = await respuesta.json();
        }

        // Ordenar según las fechas
        productosCache.sort((a, b) => {
            const fechaA = new Date(a.fecha_actualizacion_precio || a.fecha_actualizacion || a.fecha_creacion);
            const fechaB = new Date(b.fecha_actualizacion_precio || b.fecha_actualizacion || b.fecha_creacion);
            return fechaB - fechaA;
        });

        const contenedor = document.getElementById('productos');
        const mensajeBusqueda = document.getElementById('mensajeBusqueda');

        filtro = filtro.trim();

        // Si el filtro está vacío, mostramos todos y limpiamos mensaje
        if (filtro === '') {
            mensajeBusqueda.textContent = '';
            mostrarProductos(productosCache, contenedor);
            return;
        }

        // Filtrar por nombre o descripción (case-insensitive)
        const productosFiltrados = productosCache.filter(p => {
            return p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(filtro.toLowerCase()));
        });

        if (productosFiltrados.length === 0) {
            mensajeBusqueda.textContent = `No se encontraron productos para "${filtro}"`;
            mostrarProductos(productosCache, contenedor);
            // Quitar mensaje después de 5 segundos
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
        const div = document.createElement('div');
        div.className = 'col-md-4';
        div.innerHTML = `
            <div class="card h-100">
                <img src="${p.imagen || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${p.nombre}</h5>
                    <p class="card-text">${p.descripcion || 'Sin descripción.'}</p>
                    <p class="card-text"><strong>Precio:</strong> $${p.precio}</p>
                    <p class="card-text"><strong>Stock:</strong> ${p.stock}</p>
                    <a href="/detalle/?id=${p.id_producto}" class="btn btn-primary mt-2">Ver Detalle</a>
                </div>
            </div>
        `;
        contenedor.appendChild(div);
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

        // Mostrar menú de empleados si no es cliente
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