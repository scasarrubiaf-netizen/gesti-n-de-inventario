const API_PRODUCTOS = "http://localhost:8080/api/productos";
const API_MOVIMIENTOS = "http://localhost:8080/api/movimientos";

let todosLosMovimientos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarFiltroProductos();
    listarMovimientos();
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

function actualizarFechaHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleString("es-CO");
}

function cargarFiltroProductos() {
    fetch(API_PRODUCTOS)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("filtroProducto");
            data.forEach(p => {
                select.innerHTML += `<option value="${p.id}">${p.nombre}</option>`;
            });
        });
}

function listarMovimientos() {
    fetch(API_MOVIMIENTOS)
        .then(res => res.json())
        .then(data => {
            todosLosMovimientos = data;
            filtrarMovimientos();
        });
}

function filtrarMovimientos() {
    const productoId = document.getElementById("filtroProducto").value;
    const tipo = document.getElementById("filtroTipo").value;
    const periodo = document.getElementById("filtroPeriodo").value;

    let filtrados = [...todosLosMovimientos];

    if (productoId) {
        filtrados = filtrados.filter(m => m.producto.id == productoId);
    }

    if (tipo) {
        filtrados = filtrados.filter(m => m.tipo === tipo);
    }

    const ahora = new Date();
    if (periodo === "semana") {
        const inicioSemana = new Date(ahora);
        inicioSemana.setDate(ahora.getDate() - ahora.getDay());
        inicioSemana.setHours(0, 0, 0, 0);
        filtrados = filtrados.filter(m => new Date(m.fecha) >= inicioSemana);
    } else if (periodo === "mes") {
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
        filtrados = filtrados.filter(m => new Date(m.fecha) >= inicioMes);
    }

    renderMovimientos(filtrados);
}

function renderMovimientos(data) {
    const tbody = document.getElementById("movimientosBody");
    tbody.innerHTML = "";

    // Calcular resumen de la semana siempre
    const ahora = new Date();
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    inicioSemana.setHours(0, 0, 0, 0);

    let entradas = 0, salidas = 0;
    todosLosMovimientos.forEach(m => {
        if (new Date(m.fecha) >= inicioSemana) {
            if (m.tipo === "ENTRADA") entradas += m.cantidad;
            if (m.tipo === "SALIDA") salidas += m.cantidad;
        }
    });

    document.getElementById("totalEntradas").textContent = entradas;
    document.getElementById("totalSalidas").textContent = salidas;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#94a3b8;">Sin movimientos en este período</td></tr>`;
        return;
    }

    data.forEach(m => {
        const badge = m.tipo === "ENTRADA"
            ? `<span class="badge badge-entrada">📥 Entrada</span>`
            : `<span class="badge badge-salida">📤 Salida</span>`;

        tbody.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td><strong>${m.producto.nombre}</strong></td>
                <td>${badge}</td>
                <td>${m.cantidad}</td>
                <td>${new Date(m.fecha).toLocaleString("es-CO")}</td>
            </tr>
        `;
    });
}