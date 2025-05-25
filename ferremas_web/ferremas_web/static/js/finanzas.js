import { API_URL } from "./config.js";

let productosCache = [];

async function cargarProductos() {
    try {
        if (productosCache.length === 0) {
            const respuesta = await fetch(`${API_URL}/api/productos/`);
            productosCache = await respuesta.json();
        }

        productosCache.sort((a, b) => {
            const fechaA = new Date(a.fecha_actualizacion_precio || a.fecha_actualizacion || a.fecha_creacion);
            const fechaB = new Date(b.fecha_actualizacion_precio || b.fecha_actualizacion || b.fecha_creacion);
            return fechaB - fechaA;
        });

        mostrarProductos(productosCache);

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos) {
    const contenedor = document.getElementById('productos');
    contenedor.innerHTML = '';

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
            <td><a href="/detalle/?id=${p.id_producto}" class="btn btn-sm btn-primary"><i class="bi bi-eye"></i> Ver</a></td>
        `;
        contenedor.appendChild(tr);
    });
}

async function cargarVentasMensuales() {
    try {
        const ventas = [
            { mes: 'Enero', total: 500000 },
            { mes: 'Febrero', total: 750000 },
            { mes: 'Marzo', total: 620000 },
            { mes: 'Abril', total: 810000 },
            { mes: 'Mayo', total: 900000 }
        ];

        const tabla = document.getElementById('ventasMensuales');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '';

        ventas.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.mes}</td>
                <td>$${v.total.toLocaleString('es-CL')}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar ventas mensuales:', error);
    }
}

async function cargarGanancias() {
    try {
        const ganancias = 2350000;

        const tabla = document.getElementById('gananciasTotales');
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = `
            <tr><td><strong>$${ganancias.toLocaleString('es-CL')}</strong></td></tr>
        `;
    } catch (error) {
        console.error('Error al cargar ganancias:', error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    cargarVentasMensuales();
    cargarGanancias();

    const btnExportar = document.getElementById('btnExportar');
    // Botón sin funcionalidad
    btnExportar.addEventListener('click', () => {
        alert('Funcionalidad de exportar registro aún no implementada.');
    });
});
