function guardarOrdenAntesDePagar() {
  fetch('http://127.0.0.1:8000/api/crear_orden_desde_carrito/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Importante si usas autenticación con sesión
  })
  .then(response => response.json())
  .then(data => {
    if (data.orden_id) {
      console.log("Orden creada con ID:", data.orden_id);
      redirigirAMercadoPago(data.orden_id); // Llamas a tu función de pago
    } else {
      console.error("Error al crear la orden:", data.error);
    }
  })
  .catch(error => {
    console.error("Error de red:", error);
  });
}

// Ejecutar automáticamente si estamos en carrito.html
document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("carrito.html")) {
    guardarOrdenAntesDePagar();
  }
});
