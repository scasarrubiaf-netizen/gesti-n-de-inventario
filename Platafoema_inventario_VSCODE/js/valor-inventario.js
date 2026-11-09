const API_PRODUCTOS = "https://inventario-backend-97dc.onrender.com/api/productos";

let todosLosProductos = [];

document.addEventListener("DOMContentLoaded", () => {
    cargarValorInventario();
    mostrarFechaHora();
    setInterval(mostrarFechaHora, 1000);
});

function mostrarFechaHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

function cargarValorInventario() {
    fetch(API_PRODUCTOS)
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al cargar los productos");
            }
            return res.json();
        })
        .then(data => {
            todosLosProductos = data;

            // Resumen
            const totalValor = data.reduce((s, p) => s + p.cantidad * p.precio, 0);
            const totalUnidades = data.reduce((s, p) => s + p.cantidad, 0);

            document.getElementById("valorGeneral").textContent = `$${totalValor.toFixed(2)}`;
            document.getElementById("totalProductos").textContent = data.length;
            document.getElementById("totalUnidades").textContent = totalUnidades;

            pintarTabla(data);
        })
        .catch(error => {
            console.error("Error al cargar el valor del inventario:", error);
        });
}

function filtrar() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const filtrados = todosLosProductos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        (p.categoria && p.categoria.nombre.toLowerCase().includes(texto))
    );
    pintarTabla(filtrados);
}

function pintarTabla(lista) {
    const tbody = document.getElementById("tablaValor");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="sin-datos">Sin productos encontrados</td></tr>`;
        document.getElementById("valorFooter").textContent = "$0.00";
        return;
    }

    let totalFiltrado = 0;

    lista.forEach(p => {
        const subtotal = p.cantidad * p.precio;
        totalFiltrado += subtotal;

        tbody.innerHTML += `
            <tr>
                <td>${p.id}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria ? p.categoria.nombre : "Sin categoría"}</td>
                <td class="num">${p.cantidad}</td>
                <td class="num">$${p.precio.toFixed(2)}</td>
                <td class="num"><strong>$${subtotal.toFixed(2)}</strong></td>
            </tr>
        `;
    });

    document.getElementById("valorFooter").textContent = `$${totalFiltrado.toFixed(2)}`;
}