import { API_URL } from "./config.js";

// carrito.js
let carritoIdGlobal = null;


const usuario = JSON.parse(localStorage.getItem('usuario'));
if (!usuario) {
  alert('No hay usuario logueado. Por favor inicia sesión para ver el carrito.');
}
const clienteId = usuario ? usuario.id : 0;
const apiCarritoURL = `${API_URL}/api/carrito/?cliente=${clienteId}`;

// Formato para moneda CLP (Chile)
const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP'
});

async function obtenerCarrito() {
  try {
    const response = await fetch(apiCarritoURL);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      mostrarMensaje("No tienes productos en el carrito.");
      carritoIdGlobal = null; // No hay carrito disponible
      localStorage.removeItem('usuarioItems'); 
      return;
    }

    const carrito = data[0];
    carritoIdGlobal = carrito.id; // guardar id del carrito aquí
    mostrarProductosCarrito(carrito.items);
    await usuarioItems(carrito);

  } catch (error) {
    console.error("Error al obtener carrito:", error);
    mostrarMensaje("Error cargando carrito.");
    carritoIdGlobal = null;
    localStorage.removeItem('usuarioItems'); 
  }
}


function mostrarMensaje(msg) {
  const mensajeDiv = document.getElementById("carritoMensaje");
  const contenedor = document.getElementById("carritoContenedor");
  mensajeDiv.textContent = msg;
  contenedor.innerHTML = '';  // limpiar tabla si hay mensaje
  document.getElementById("carrito-total-convertido").textContent = '';
}

// Agregar botón eliminar por producto en la tabla (modificación mínima en mostrarProductosCarrito)
async function mostrarProductosCarrito(items) {
  if (!items || items.length === 0) {
    mostrarMensaje("No tienes productos en el carrito.");
    return;
  }

  const productosDetallados = await Promise.all(items.map(async (item) => {
    const resp = await fetch(`${API_URL}/api/productos/${item.producto}/`);
    const producto = await resp.json();
    return {
      ...item,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      currency_id: producto.currency_id
    };
  }));

  let tablaHTML = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>  <!-- Nueva columna para botón eliminar -->
                </tr>
            </thead>
            <tbody>
    `;

  let total = 0;
  productosDetallados.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    tablaHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>
                  <button onclick="actualizarCantidad(${item.producto}, -1, ${item.cantidad}, ${item.stock})" class="btn btn-sm btn-danger">-</button>
                  ${item.cantidad}
                  <button onclick="actualizarCantidad(${item.producto}, 1, ${item.cantidad}, ${item.stock})" class="btn btn-sm btn-success">+</button>
                </td>
                <td>${formatoCLP.format(item.precio)}</td>
                <td>${formatoCLP.format(subtotal)}</td>
                <td>
                  <button onclick="eliminarProducto(${item.producto})" class="btn btn-sm btn-outline-danger">Eliminar</button>
                </td>
            </tr>
        `;
  });

  tablaHTML += `
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="4" class="text-end">Total:</th>
                    <th>${formatoCLP.format(total)}</th>
                </tr>
            </tfoot>
        </table>
    `;

  document.getElementById("carritoContenedor").innerHTML = tablaHTML;
  document.getElementById("carrito-total-convertido").textContent = '';
}

// Nueva función para eliminar un producto del carrito
async function eliminarProducto(productoId) {
  if (!carritoIdGlobal) {
    alert('No hay carrito disponible.');
    return;
  }

  try {
    // Llamada DELETE para eliminar item del carrito
    const response = await fetch(`${API_URL}/api/eliminar-item/`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        carrito: carritoIdGlobal,
        producto: productoId
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('Producto eliminado del carrito');
      obtenerCarrito(); // refrescar
    } else {
      alert(data.error || 'Error al eliminar producto.');
    }
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// Función para vaciar el carrito completo
async function vaciarCarrito() {
  if (!carritoIdGlobal) return;

  try {
    const response = await fetch(`${API_URL}/api/vaciar-carrito/${carritoIdGlobal}/`, {
      method: 'DELETE'
    });

    if (response.ok) {
      carritoIdGlobal = null;
      mostrarMensaje("No tienes productos en el carrito.");
      localStorage.removeItem('usuarioItems');
    } else {
      console.error('Error al vaciar carrito:', await response.json());
    }
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
  }
}


// Nueva función para actualizar cantidad (+1 o -1)
async function actualizarCantidad(productoId, delta, cantidadActual, stock) {
  const nuevaCantidad = cantidadActual + delta;

  // Validaciones básicas
  if (nuevaCantidad < 1) {
    alert('La cantidad no puede ser menor a 1.');
    return;
  }
  if (nuevaCantidad > stock) {
    alert('No hay suficiente stock disponible.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/agregar-item/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        carrito: carritoIdGlobal, // <-- aquí usamos carritoIdGlobal
        producto: productoId,
        cantidad: delta
      })
    });
    const data = await response.json();

    if (response.ok) {
      obtenerCarrito();  // refrescar el carrito para mostrar la nueva cantidad
    } else {
      alert(data.error || 'Error al actualizar cantidad.');
    }
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
  }
}



// Cargar carrito al iniciar
document.addEventListener('DOMContentLoaded', () => {
  obtenerCarrito();
});

async function convertirCarritoMoneda() {
  const selector = document.getElementById("currency-selector");
  const monedaSeleccionada = selector.value;

  if (monedaSeleccionada === "CLP") {
    document.getElementById("carrito-total-convertido").textContent = '';
    return;
  }

  try {
    // Obtener total actual en CLP
    const tabla = document.querySelector("#carritoContenedor table");
    const totalFila = tabla.querySelector("tfoot tr th:last-child").textContent;
    const totalCLP = parseFloat(totalFila.replace(/[^\d]/g, '')); // quitar símbolo y puntos

    // Llamada a la API para obtener la tasa de conversión
    const response = await fetch(`${API_URL}/api/conversion/?moneda=${monedaSeleccionada}`);
    const data = await response.json();

    if (!response.ok || !data.tasa_conversion) {
      document.getElementById("carrito-total-convertido").textContent = 'Error obteniendo conversión';
      return;
    }

    const tasa = data.tasa_conversion;
    const totalConvertido = (totalCLP * tasa).toFixed(2);

    const formatter = new Intl.NumberFormat('es', {
      style: 'currency',
      currency: monedaSeleccionada
    });

    document.getElementById("carrito-total-convertido").textContent =
      `Total convertido: ${formatter.format(totalConvertido)}`;

  } catch (error) {
    console.error("Error al convertir moneda:", error);
    document.getElementById("carrito-total-convertido").textContent = 'Error en conversión';
  }
}

const stripe = Stripe('');

document.getElementById('boton-compra').addEventListener('click', async () => {
  const carritoItems = obtenerItemsCarrito();

  console.log("Enviando al backend:", carritoItems); // 👈 VERIFICA qué estás enviando

  const response = await fetch(`${API_URL}/api/pago/stripe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items: carritoItems })
  });

  const data = await response.json();
  
  if (data.id) {
    stripe.redirectToCheckout({ sessionId: data.id });
  } else {
    alert("Error al iniciar el pago");
    console.log("Error:", data);
  }
});

function obtenerItemsCarrito() {
  const itemsGuardados = JSON.parse(localStorage.getItem('usuarioItems')) || [];

  return itemsGuardados.map(item => ({
    nombre: item.nombre,
    cantidad: item.cantidad,
    precio: Math.round(item.precio)/100  // convertir a centavos entero
  }));
}

async function usuarioItems(carrito) {
  if (!carrito || !carrito.items || carrito.items.length === 0) {
    localStorage.removeItem('usuarioItems');
    return;
  }

  const listaDetallada = await Promise.all(carrito.items.map(async (item) => {
    const resp = await fetch(`${API_URL}/api/productos/${item.producto}/`);
    const producto = await resp.json();

    return {
      id_carrito: carrito.id,
      id_producto: item.producto,
      cantidad: item.cantidad,
      nombre: producto.nombre,
      fabricante: producto.fabricante,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      imagen: producto.imagen,
      fecha_creacion: producto.fecha_creacion,
      fecha_actualizacion: producto.fecha_actualizacion,
      fecha_actualizacion_precio: producto.fecha_actualizacion_precio
    };
  }));

  localStorage.setItem('usuarioItems', JSON.stringify(listaDetallada));
}

window.convertirCarritoMoneda = convertirCarritoMoneda;
window.vaciarCarrito = vaciarCarrito;
window.eliminarProducto = eliminarProducto;
window.actualizarCantidad = actualizarCantidad;