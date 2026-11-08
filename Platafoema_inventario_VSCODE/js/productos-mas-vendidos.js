const API_MOVIMIENTOS = "http://localhost:8080/api/movimientos";
const API_PRODUCTOS = "http://localhost:8080/api/productos";

document.addEventListener("DOMContentLoaded", () => {
    mostrarFechaHora();
    setInterval(mostrarFechaHora, 1000);
    cargarProductosMasVendidos();
});

function mostrarFechaHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

function cargarProductosMasVendidos() {
    Promise.all([
        fetch(API_MOVIMIENTOS).then(r => r.json()),
        fetch(API_PRODUCTOS).then(r => r.json())
    ]).then(([movimientos, productos]) => {

        const salidas = movimientos.filter(m => m.tipo === "SALIDA");

        const ventasPorProducto = {};
        salidas.forEach(m => {
            const id = m.producto.id;
            ventasPorProducto[id] = (ventasPorProducto[id] || 0) + m.cantidad;
        });

        const datos = productos
            .map(p => ({
                nombre: p.nombre,
                vendidos: ventasPorProducto[p.id] || 0
            }))
            .filter(d => d.vendidos > 0)
            .sort((a, b) => b.vendidos - a.vendidos);

        // Resumen
        const totalUnidades = datos.reduce((s, d) => s + d.vendidos, 0);
        document.getElementById("totalUnidades").textContent = totalUnidades;
        document.getElementById("productosConVentas").textContent = datos.length;
        document.getElementById("liderVentas").textContent =
            datos.length > 0 ? datos[0].nombre : "—";

        if (datos.length === 0) {
            document.getElementById("sinDatosGrafica").style.display = "block";
            document.getElementById("chartMasVendidos").style.display = "none";
            return;
        }

        crearGrafica(datos);
        crearRanking(datos);
    });
}

function crearGrafica(datos) {
    const ctx = document.getElementById("chartMasVendidos").getContext("2d");

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: datos.map(d => d.nombre),
            datasets: [{
                label: "Unidades vendidas",
                data: datos.map(d => d.vendidos),
                backgroundColor: "#1e293b",
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    grid: { color: "#f1f5f9" }
                }
            }
        }
    });
}

function crearRanking(datos) {
    const tbody = document.getElementById("tablaRanking");
    tbody.innerHTML = "";

    const maximo = datos[0].vendidos;

    datos.forEach((d, i) => {
        const claseNum = i === 0 ? "top1" : i === 1 ? "top2" : i === 2 ? "top3" : "";
        const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
        const porcentaje = Math.round((d.vendidos / maximo) * 100);

        tbody.innerHTML += `
            <tr>
                <td><span class="ranking-num ${claseNum}">${medalla || "#" + (i + 1)}</span></td>
                <td>
                    <div>${d.nombre}</div>
                    <div class="barra-progreso">
                        <div class="barra-fill" style="width:${porcentaje}%"></div>
                    </div>
                </td>
                <td><strong>${d.vendidos}</strong></td>
            </tr>
        `;
    });
}
