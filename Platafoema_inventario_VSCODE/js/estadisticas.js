
const API_MOVIMIENTOS = "https://inventario-backend-97dc.onrender.com/api/movimientos";
const API_PRODUCTOS = "https://inventario-backend-97dc.onrender.com/api/productos";

let chart1, chart2, chart3;

document.addEventListener("DOMContentLoaded", () => {
    actualizarHora();
    setInterval(actualizarHora, 1000);
    cargarEstadisticas();
});

function actualizarHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

function cargarEstadisticas() {
    const mesFiltro = document.getElementById("mes").value;
    const anioFiltro = document.getElementById("anio").value;

    Promise.all([
        fetch(API_MOVIMIENTOS).then(r => {
            if (!r.ok) throw new Error("Error al consultar movimientos");
            return r.json();
        }),
        fetch(API_PRODUCTOS).then(r => {
            if (!r.ok) throw new Error("Error al consultar productos");
            return r.json();
        })
    ])
    .then(([movimientos, productos]) => {

        let salidas = movimientos.filter(m => m.tipo === "SALIDA");

        if (mesFiltro !== "") {
            salidas = salidas.filter(m =>
                new Date(m.fecha).getMonth() == mesFiltro);
        }

        if (anioFiltro !== "") {
            salidas = salidas.filter(m =>
                new Date(m.fecha).getFullYear() == anioFiltro);
        }

        const ventas = {};

        salidas.forEach(m => {
            const id = m.producto.id;
            ventas[id] = (ventas[id] || 0) + m.cantidad;
        });

        const datos = productos.map(p => ({
            nombre: p.nombre,
            stock: p.cantidad,
            ventas: ventas[p.id] || 0
        })).sort((a, b) => b.ventas - a.ventas);

        // Resumen
        const totalVendido = Object.values(ventas).reduce((s, v) => s + v, 0);
        const sinVentas = datos.filter(d => d.ventas === 0).length;
        const top = datos[0];

        document.getElementById("totalVendido").textContent = totalVendido;
        document.getElementById("topProducto").textContent =
            top && top.ventas > 0 ? top.nombre : "—";
        document.getElementById("sinVentas").textContent = sinVentas;

        crearMasVendidos(datos.slice(0, 5));
        crearMenosVendidos([...datos].reverse().slice(0, 5));
        crearVentasVsStock(datos);
    })
    .catch(error => {
        console.error("Error al cargar estadísticas:", error);
        alert("No se pudieron cargar las estadísticas. Intenta nuevamente.");
    });
}

const opcionesBase = {
    responsive: true,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, grid: { color: "#f1f5f9" } }
    }
};

function crearMasVendidos(data) {
    if (chart1) chart1.destroy();

    chart1 = new Chart(document.getElementById("graficaMasVendidos"), {
        type: "bar",
        data: {
            labels: data.map(d => d.nombre),
            datasets: [{
                label: "Vendidos",
                data: data.map(d => d.ventas),
                backgroundColor: "#1e293b",
                borderRadius: 6
            }]
        },
        options: opcionesBase
    });
}

function crearMenosVendidos(data) {
    if (chart2) chart2.destroy();

    chart2 = new Chart(document.getElementById("graficaMenosVendidos"), {
        type: "bar",
        data: {
            labels: data.map(d => d.nombre),
            datasets: [{
                label: "Vendidos",
                data: data.map(d => d.ventas),
                backgroundColor: "#94a3b8",
                borderRadius: 6
            }]
        },
        options: opcionesBase
    });
}

function crearVentasVsStock(data) {
    if (chart3) chart3.destroy();

    chart3 = new Chart(document.getElementById("graficaVentasStock"), {
        type: "line",
        data: {
            labels: data.map(d => d.nombre),
            datasets: [
                {
                    label: "Ventas",
                    data: data.map(d => d.ventas),
                    borderColor: "#1e293b",
                    backgroundColor: "rgba(30,41,59,0.05)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: "Stock",
                    data: data.map(d => d.stock),
                    borderColor: "#94a3b8",
                    backgroundColor: "rgba(148,163,184,0.05)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: "top",
                    labels: { font: { size: 12 }, color: "#475569" }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true, grid: { color: "#f1f5f9" } }
            }
        }
    });
}
