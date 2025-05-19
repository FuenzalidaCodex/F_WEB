let productosCache = [];
const apiUrl = 'http://127.0.0.1:8000/api/productos/';

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    const btnAgregar = document.getElementById('btnAgregarProducto');
    const modalProducto = new bootstrap.Modal(document.getElementById('modalProducto'));
    const formProducto = document.getElementById('formProducto');

    btnAgregar.addEventListener('click', () => {
        limpiarFormulario();
        document.getElementById('modalProductoLabel').textContent = 'Agregar Producto';
        modalProducto.show();
    });

    formProducto.addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarProducto();
        modalProducto.hide();
    });
});

async function cargarProductos() {
    try {
        const respuesta = await fetch(apiUrl);
        if (!respuesta.ok) {
            console.error('Error HTTP al cargar productos:', respuesta.status);
            alert('Error al cargar productos: ' + respuesta.status);
            return;
        }
        productosCache = await respuesta.json();
        console.log('Productos cargados:', productosCache);
        mostrarProductos(productosCache);
    } catch (error) {
        console.error('Error cargando productos:', error);
        alert('Error cargando productos, revisa la consola');
    }
}

function mostrarProductos(productos) {
    const tbody = document.querySelector('#tablaProductos tbody');
    tbody.innerHTML = '';

    productos.forEach(p => {
        console.log('Producto:', p); // Verificar estructura

        const id = p.id_producto ?? p.id ?? null;
        if (id === null) {
            console.warn('Producto sin ID:', p);
            return;
        }

        const nombre = p.nombre ?? 'Sin nombre';
        const descripcion = p.descripcion ?? '';
        const precio = Number(p.precio) || 0;  // <-- Cambio aquí
        const stock = p.stock ?? 0;
        const fecha = p.fecha_actualizacion ?? p.fecha_creacion ?? '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${nombre}</td>
            <td>${descripcion}</td>
            <td>$${precio.toFixed(2)}</td>
            <td>${stock}</td>
            <td>${formatearFecha(fecha)}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editarProducto(${id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${id})">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString() + ' ' + fecha.toLocaleTimeString();
}

function limpiarFormulario() {
    document.getElementById('idProducto').value = '';
    document.getElementById('nombreProducto').value = '';
    document.getElementById('descripcionProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('stockProducto').value = '';
    document.getElementById('imagenProducto').value = '';
}

function editarProducto(id) {
    const producto = productosCache.find(p => (p.id_producto ?? p.id) === id);
    if (!producto) return alert('Producto no encontrado');

    document.getElementById('idProducto').value = producto.id_producto ?? producto.id;
    document.getElementById('nombreProducto').value = producto.nombre ?? '';
    document.getElementById('descripcionProducto').value = producto.descripcion ?? '';
    document.getElementById('precioProducto').value = producto.precio ?? 0;
    document.getElementById('stockProducto').value = producto.stock ?? 0;
    document.getElementById('imagenProducto').value = producto.imagen ?? '';

    document.getElementById('modalProductoLabel').textContent = 'Editar Producto';

    const modalProducto = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
    modalProducto.show();
}

async function guardarProducto() {
    const id = document.getElementById('idProducto').value;
    const nombre = document.getElementById('nombreProducto').value.trim();
    const descripcion = document.getElementById('descripcionProducto').value.trim();
    const precio = parseFloat(document.getElementById('precioProducto').value);
    const stock = parseInt(document.getElementById('stockProducto').value);
    const imagen = document.getElementById('imagenProducto').value.trim();

    const productoData = {
        nombre,
        descripcion,
        precio,
        stock,
        imagen,
    };

    try {
        let respuesta;
        if (id) {
            respuesta = await fetch(apiUrl + id + '/', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoData),
            });
        } else {
            respuesta = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoData),
            });
        }

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            alert('Error al guardar producto: ' + JSON.stringify(errorData));
            return;
        }

        await cargarProductos();
    } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Error guardando producto');
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const respuesta = await fetch(apiUrl + id + '/', {
            method: 'DELETE',
        });

        if (!respuesta.ok) {
            alert('Error al eliminar producto');
            return;
        }

        await cargarProductos();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error eliminando producto');
    }
}
