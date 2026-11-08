const API_PRODUCTOS = "http://localhost:8080/api/productos";

document.addEventListener("DOMContentLoaded", () => {
    cargarReporte();
    mostrarFechaHora();
    setInterval(mostrarFechaHora, 1000);
});

function mostrarFechaHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

function cargarReporte() {
    fetch(API_PRODUCTOS)
        .then(res => res.json())
        .then(data => {
            const criticos = data.filter(p => p.cantidad <= p.stockMinimo);

            // Resumen
            document.getElementById("totalProductos").textContent = data.length;
            document.getElementById("totalCriticos").textContent = criticos.length;

            if (criticos.length > 0) {
                const masCritico = criticos.reduce((min, p) =>
                    p.cantidad < min.cantidad ? p : min, criticos[0]);
                document.getElementById("masCritico").textContent = masCritico.nombre;
            } else {
                document.getElementById("masCritico").textContent = "—";
            }

            pintarTabla(criticos);
        });
}

function pintarTabla(lista) {
    const tbody = document.getElementById("tablaCriticos");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="sin-datos">
                    <span>✅</span>
                    Todos los productos tienen stock suficiente
                </td>
            </tr>
        `;
        return;
    }

    lista.forEach(p => {
        const agotado = p.cantidad === 0;
        const nivel = agotado
            ? `<span class="nivel-critico nivel-agotado">🔴 Agotado</span>`
            : `<span class="nivel-critico nivel-bajo">🟡 Stock bajo</span>`;

        const porcentaje = p.stockMinimo > 0
            ? Math.min(Math.round((p.cantidad / p.stockMinimo) * 100), 100)
            : 0;

        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria ? p.categoria.nombre : "Sin categoría"}</td>
                <td>
                    <div class="barra-stock">
                        <span>${p.cantidad}</span>
                        <div class="barra-bg">
                            <div class="barra-fill-stock" style="width:${porcentaje}%"></div>
                        </div>
                    </div>
                </td>
                <td>${p.stockMinimo}</td>
                <td>${nivel}</td>
            </tr>
        `;
    });
}