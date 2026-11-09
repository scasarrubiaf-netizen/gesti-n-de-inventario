
const API_PRODUCTOS = "https://inventario-backend-97dc.onrender.com/api/productos";
const API_VENTAS = "https://inventario-backend-97dc.onrender.com/api/ventas";

let carrito = [];
let total = 0;
let metodoPago = "efectivo";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("codigoProducto").addEventListener("keyup", e => {
        if (e.key === "Enter") agregarProducto();
    });

    document.getElementById("pago").addEventListener("keyup", e => {
        if (e.key === "Enter") finalizarVenta();
    });

    document.getElementById("btnAgregar").addEventListener("click", agregarProducto);
    document.getElementById("btnCobrar").addEventListener("click", finalizarVenta);
    document.getElementById("btnCerrarFactura").addEventListener("click", cerrarFactura);
    document.getElementById("btnImprimir").addEventListener("click", () => window.print());
});

/* ================= MÉTODO DE PAGO ================= */
function seleccionarMetodo(metodo) {
    metodoPago = metodo;

    document.getElementById("btnEfectivo").classList.toggle("activo", metodo === "efectivo");
    document.getElementById("btnTarjeta").classList.toggle("activo", metodo === "tarjeta");

    if (metodo === "tarjeta") {
        document.getElementById("seccionPago").style.display = "none";
        document.getElementById("seccionTarjeta").style.display = "block";
        document.getElementById("totalTarjeta").textContent = total.toFixed(2);
    } else {
        document.getElementById("seccionPago").style.display = "block";
        document.getElementById("seccionTarjeta").style.display = "none";
    }
}

/* ================= AGREGAR PRODUCTO ================= */
function agregarProducto() {
    const codigoInput = document.getElementById("codigoProducto");
    const cantidadInput = document.getElementById("cantidad");

    const codigo = codigoInput.value.trim();
    const cantidad = parseInt(cantidadInput.value);

    if (!codigo || isNaN(cantidad) || cantidad <= 0) return;

    fetch(`${API_PRODUCTOS}/codigo/${codigo}`)
        .then(res => {
            if (!res.ok) throw new Error("Producto no encontrado");
            return res.json();
        })
        .then(p => {
            const existente = carrito.find(i => i.productoId === p.id);

            if (existente) {
                existente.cantidad += cantidad;
                existente.subtotal = existente.cantidad * existente.precio;
            } else {
                carrito.push({
                    productoId: p.id,
                    nombre: p.nombre,
                    precio: p.precio,
                    cantidad: cantidad,
                    subtotal: p.precio * cantidad
                });
            }

            recalcularTotal();
            actualizarTabla();

            codigoInput.value = "";
            cantidadInput.value = 1;
            codigoInput.focus();
        })
        .catch(error => {
            console.error("Error al buscar producto:", error);
            alert("Producto no encontrado");
        });
}

/* ================= ACTUALIZAR TABLA ================= */
function actualizarTabla() {
    const tbody = document.getElementById("tablaVenta");
    tbody.innerHTML = "";

    if (carrito.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="carrito-vacio">Sin productos agregados</td>
            </tr>`;
        document.getElementById("total").textContent = "0.00";
        document.getElementById("subtotalDisplay").textContent = "0.00";
        document.getElementById("cantProductos").textContent = "0";
        document.getElementById("cambio").textContent = "0.00";
        document.getElementById("totalTarjeta").textContent = "0.00";
        return;
    }

    carrito.forEach((p, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.nombre}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${p.cantidad}</td>
            <td>$${p.subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarItem(${index})">✕</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById("total").textContent = total.toFixed(2);
    document.getElementById("subtotalDisplay").textContent = total.toFixed(2);
    document.getElementById("cantProductos").textContent = carrito.reduce((s, p) => s + p.cantidad, 0);
    document.getElementById("totalTarjeta").textContent = total.toFixed(2);

    const pago = parseFloat(document.getElementById("pago").value) || 0;
    const cambio = pago - total;
    document.getElementById("cambio").textContent = cambio >= 0 ? cambio.toFixed(2) : "0.00";
}

/* ================= ELIMINAR ITEM ================= */
function eliminarItem(index) {
    carrito.splice(index, 1);
    recalcularTotal();
    actualizarTabla();
}

/* ================= RECALCULAR TOTAL ================= */
function recalcularTotal() {
    total = carrito.reduce((s, p) => s + p.subtotal, 0);
}

/* ================= FINALIZAR VENTA ================= */
function finalizarVenta() {
    if (carrito.length === 0) {
        alert("Agrega productos al carrito primero");
        return;
    }

    let pago = total;
    let cambio = 0;

    if (metodoPago === "efectivo") {
        pago = parseFloat(document.getElementById("pago").value);

        if (isNaN(pago) || pago <= 0) {
            alert("Ingresa el monto recibido");
            return;
        }

        if (pago < total) {
            alert("El pago es insuficiente");
            return;
        }

        cambio = pago - total;
    }

    const btnCobrar = document.getElementById("btnCobrar");
    btnCobrar.disabled = true;
    btnCobrar.textContent = "Procesando...";

    fetch(API_VENTAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            pago,
            total,
            empleado: localStorage.getItem("usuario"),
            metodoPago,
            detalles: carrito.map(item => ({
                productoId: item.productoId,
                cantidad: item.cantidad
            }))
        })
    })
    .then(res => {
        if (!res.ok) throw new Error("No se pudo procesar la venta");
        return res.json();
    })
    .then(() => {
        mostrarFactura({ pago, total, cambio, detalles: carrito, metodoPago });
        carrito = [];
        total = 0;
        actualizarTabla();
        document.getElementById("pago").value = "";
        seleccionarMetodo("efectivo");
    })
    .catch(error => {
        console.error("Error al procesar la venta:", error);
        alert("Error al procesar la venta");
    })
    .finally(() => {
        btnCobrar.disabled = false;
        btnCobrar.textContent = "✅ Cobrar";
    });
}

/* ================= MOSTRAR FACTURA ================= */
function mostrarFactura(venta) {
    document.getElementById("facturaId").textContent = Date.now();
    document.getElementById("facturaFecha").textContent = new Date().toLocaleString();
    document.getElementById("facturaMetodoPago").textContent =
        venta.metodoPago === "tarjeta" ? "💳 Tarjeta" : "💵 Efectivo";

    const contenedor = document.getElementById("facturaDetalle");
    contenedor.innerHTML = "";

    venta.detalles.forEach(p => {
        contenedor.innerHTML += `
            <div class="factura-item">
                <span>${p.nombre} x${p.cantidad}</span>
                <span>$${p.subtotal.toFixed(2)}</span>
            </div>
        `;
    });

    document.getElementById("facturaSubtotal").textContent = venta.total.toFixed(2);
    document.getElementById("facturaTotal").textContent = venta.total.toFixed(2);
    document.getElementById("facturaPago").textContent = venta.pago.toFixed(2);
    document.getElementById("facturaCambio").textContent = venta.cambio.toFixed(2);

    document.getElementById("modalFactura").classList.add("activo");
}

/* ================= CERRAR FACTURA ================= */
function cerrarFactura() {
    document.getElementById("modalFactura").classList.remove("activo");
}
