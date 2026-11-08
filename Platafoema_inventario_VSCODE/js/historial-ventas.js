const API_VENTAS = "http://localhost:8080/api/ventas";
const API_USUARIOS = "http://localhost:8080/api/usuarios";

const rol = localStorage.getItem("rol");
const usuario = localStorage.getItem("usuario");

if (!rol || !usuario) {
    window.location.href = "../login.html";
}

// ===== SIDEBAR SEGÚN ROL =====
document.getElementById("sidebarTitulo").textContent = rol === "ADMIN" ? "📦 Inventarios" : "💼 POS";
document.getElementById("nombreSidebar").textContent = usuario;

const menuNav = document.getElementById("menuNav");
if (rol === "ADMIN") {
    menuNav.innerHTML = `
        <a href="dashboard.html">📊 Dashboard</a>
        <a href="productos.html">📦 Productos</a>
        <a href="movimientos.html">🔄 Movimientos</a>
        <a href="categorias.html">🗂 Categorías</a>
        <a href="estadisticas.html">📈 Estadísticas</a>
        <a href="productos-mas-vendidos.html">🏆 Más vendidos</a>
        <a href="reporte-stock.html">📉 Reporte stock</a>
        <a href="valor-inventario.html">💰 Valor inventario</a>
        <a href="historial-ventas.html" class="active">🧾 Historial ventas</a>
    `;
    // Mostrar filtros y columna empleado
    document.getElementById("filtrosAdmin").style.display = "flex";
    cargarFiltroEmpleados();
} else {
    menuNav.innerHTML = `
        <a href="ventas.html">🧾 Ventas</a>
        <a href="reporte-stock.html">⚠️ Stock crítico</a>
        <a href="perfil.html">👤 Mi perfil</a>
        <a href="historial-ventas.html" class="active">📋 Mis ventas</a>
    `;
    // Ocultar columna empleado para empleado
    document.getElementById("colEmpleado").style.display = "none";
}

// ===== FECHA Y HORA =====
function actualizarHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}
actualizarHora();
setInterval(actualizarHora, 1000);

// ===== CARGAR FILTRO EMPLEADOS (solo admin) =====
function cargarFiltroEmpleados() {
    fetch(API_USUARIOS)
        .then(res => res.json())
        .then(usuarios => {
            const select = document.getElementById("filtroEmpleado");
            usuarios.forEach(u => {
                select.innerHTML += `<option value="${u.username}">${u.username}</option>`;
            });
        });
}

// ===== CARGAR VENTAS =====
function cargarVentas() {
    let url = API_VENTAS;

    if (rol === "EMPLEADO") {
        url = `${API_VENTAS}/empleado/${usuario}`;
    } else {
        const filtroEmpleado = document.getElementById("filtroEmpleado")?.value;
        if (filtroEmpleado) {
            url = `${API_VENTAS}/empleado/${filtroEmpleado}`;
        }
    }

    fetch(url)
        .then(res => res.json())
        .then(ventas => {
            // Filtrar por fecha si aplica
            const filtroFecha = document.getElementById("filtroFecha")?.value;
            if (filtroFecha) {
                ventas = ventas.filter(v =>
                    new Date(v.fecha).toLocaleDateString() ===
                    new Date(filtroFecha).toLocaleDateString()
                );
            }

            actualizarResumen(ventas);
            pintarTabla(ventas);
        });
}

// ===== RESUMEN =====
function actualizarResumen(ventas) {
    const totalRecaudado = ventas.reduce((s, v) => s + v.total, 0);
    const promedio = ventas.length > 0 ? totalRecaudado / ventas.length : 0;

    document.getElementById("totalVentas").textContent = ventas.length;
    document.getElementById("totalRecaudado").textContent = `$${totalRecaudado.toFixed(2)}`;
    document.getElementById("promedio").textContent = `$${promedio.toFixed(2)}`;
}

// ===== PINTAR TABLA =====
function pintarTabla(ventas) {
    const tbody = document.getElementById("tablaVentas");
    tbody.innerHTML = "";

    if (ventas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="sin-datos">Sin ventas registradas</td></tr>`;
        return;
    }

    ventas.forEach((v, i) => {
        tbody.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${new Date(v.fecha).toLocaleString("es-CO")}</td>
                <td>${v.empleado || "—"}</td>
                <td><strong>$${v.total.toFixed(2)}</strong></td>
                <td>$${v.pago.toFixed(2)}</td>
                <td>$${v.cambio.toFixed(2)}</td>
                <td>
                    <button class="btn-ver" onclick="verDetalle(${JSON.stringify(v).replace(/"/g, '&quot;')})">
                        👁 Ver
                    </button>
                </td>
            </tr>
        `;
    });
}

// ===== VER DETALLE =====
function verDetalle(venta) {
    document.getElementById("detallesFecha").textContent =
        new Date(venta.fecha).toLocaleString("es-CO");
    document.getElementById("detallesEmpleado").textContent = venta.empleado || "—";
    document.getElementById("detallesPago").textContent = `$${venta.pago.toFixed(2)}`;
    document.getElementById("detallesCambio").textContent = `$${venta.cambio.toFixed(2)}`;
    document.getElementById("detallesTotal").textContent = `$${venta.total.toFixed(2)}`;

    const contenedor = document.getElementById("detallesProductos");
    contenedor.innerHTML = "";

    if (venta.detalles && venta.detalles.length > 0) {
        venta.detalles.forEach(d => {
            contenedor.innerHTML += `
                <div class="detalle-item">
                    <span>${d.producto.nombre} x${d.cantidad}</span>
                    <span>$${d.subtotal.toFixed(2)}</span>
                </div>
            `;
        });
    } else {
        contenedor.innerHTML = `<p style="color:#94a3b8;font-size:13px;">Sin detalles disponibles</p>`;
    }

    document.getElementById("modalDetalle").classList.add("activo");
}

function cerrarDetalle() {
    document.getElementById("modalDetalle").classList.remove("activo");
}

function limpiarFiltros() {
    document.getElementById("filtroEmpleado").value = "";
    document.getElementById("filtroFecha").value = "";
    cargarVentas();
}

function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "../login.html";
}

// Cargar al inicio
cargarVentas();