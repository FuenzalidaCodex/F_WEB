// Datos simulados para productos
const productosCache = [
    { id_producto: 1, nombre: "Martillo", precio: 15000, imagen: '', descripcion: 'Martillo de acero', stock: 10, fecha_creacion: '2025-05-10' },
    { id_producto: 2, nombre: "Taladro", precio: 45000, imagen: '', descripcion: 'Taladro inalámbrico', stock: 5, fecha_creacion: '2025-05-08' },
    { id_producto: 3, nombre: "Destornillador", precio: 8000, imagen: '', descripcion: 'Destornillador plano', stock: 20, fecha_creacion: '2025-05-11' },
    { id_producto: 4, nombre: "Cinta métrica", precio: 12000, imagen: '', descripcion: 'Cinta métrica 5m', stock: 15, fecha_creacion: '2025-05-12' }
];

// Datos simulados para carritos de compras
const carritos = [
    {
        id_carrito: 101,
        nombre_cliente: 'Juan Pérez',
        productos: [
            { id_producto: 1, cantidad: 2 },
            { id_producto: 4, cantidad: 1 }
        ]
    },
    {
        id_carrito: 102,
        nombre_cliente: 'Ana Gómez',
        productos: [
            { id_producto: 2, cantidad: 1 },
            { id_producto: 3, cantidad: 3 }
        ]
    }
];

// Función para mostrar resumen por carrito
function mostrarResumenCarritos(carritos, productos) {
    const contenedor = document.getElementById('resumenCompras');
    contenedor.innerHTML = '';

    carritos.forEach(carrito => {
        let totalCarrito = 0;

        // Crear div contenedor para cada carrito
        const divCarrito = document.createElement('div');
        divCarrito.classList.add('mb-5');

        // Título con info del cliente y carrito
        const titulo = document.createElement('h4');
        titulo.textContent = `Carrito #${carrito.id_carrito} - Cliente: ${carrito.nombre_cliente}`;
        divCarrito.appendChild(titulo);

        // Crear tabla Bootstrap
        const tabla = document.createElement('table');
        tabla.classList.add('table', 'table-striped', 'table-hover', 'align-middle', 'table-responsive');
        tabla.innerHTML = `
            <thead class="table-dark">
                <tr>
                    <th>Producto</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = tabla.querySelector('tbody');

        carrito.productos.forEach(item => {
            const prod = productos.find(p => p.id_producto === item.id_producto);
            if (prod) {
                const subtotal = prod.precio * item.cantidad;
                totalCarrito += subtotal;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${prod.nombre}</td>
                    <td>${prod.descripcion || 'Sin descripción'}</td>
                    <td>${item.cantidad}</td>
                    <td>$${prod.precio.toLocaleString('es-CL')}</td>
                    <td>$${subtotal.toLocaleString('es-CL')}</td>
                `;
                tbody.appendChild(tr);
            }
        });

        // Fila total del carrito
        const trTotal = document.createElement('tr');
        trTotal.innerHTML = `
            <td colspan="4" class="text-end fw-bold">Total Carrito:</td>
            <td class="fw-bold">$${totalCarrito.toLocaleString('es-CL')}</td>
        `;
        tbody.appendChild(trTotal);

        divCarrito.appendChild(tabla);
        contenedor.appendChild(divCarrito);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarResumenCarritos(carritos, productosCache);
});
