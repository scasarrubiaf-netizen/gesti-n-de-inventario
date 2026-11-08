const API_PRODUCTOS = "http://localhost:8080/api/productos";
const API_CATEGORIAS = "http://localhost:8080/api/categorias";

let productos = [];
let productoEditandoId = null;

document.addEventListener("DOMContentLoaded", () => {
    listarProductos();
    cargarCategorias();
    mostrarFechaHora();

    document.getElementById("buscador")
        .addEventListener("keyup", filtrarProductos);

    setInterval(mostrarFechaHora, 1000);
});

function mostrarFechaHora() {
    const ahora = new Date();
    document.getElementById("fechaHora").textContent =
        ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
}

function listarProductos() {
    fetch(API_PRODUCTOS)
        .then(res => res.json())
        .then(data => {
            productos = data;
            pintarTabla(data);
        });
}

function pintarTabla(lista) {
    const tbody = document.getElementById("tablaProductos");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:#94a3b8;">Sin productos registrados</td></tr>`;
        return;
    }

    lista.forEach(p => {
        const stockBajo = p.cantidad <= p.stockMinimo;
        const badge = stockBajo
            ? `<span class="badge-stock badge-bajo">⚠ Stock bajo</span>`
            : `<span class="badge-stock badge-ok">✓ OK</span>`;

        tbody.innerHTML += `
            <tr class="${stockBajo ? 'stock-bajo' : ''}">
                <td>${p.id}</td>
                <td>${p.codigoBarra ?? "—"}</td>
                <td><strong>${p.nombre}</strong></td>
                <td>${p.categoria ? p.categoria.nombre : "Sin categoría"}</td>
                <td>${p.cantidad}</td>
                <td>${p.stockMinimo}</td>
                <td>$${parseFloat(p.precio).toFixed(2)}</td>
                <td>${badge}</td>
                <td>
                    <button class="btn-editar" onclick="editarProducto(${p.id})">✏ Editar</button>
                    <button class="btn-eliminar" onclick="eliminarProducto(${p.id})">🗑 Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function filtrarProductos() {
    const texto = document.getElementById("buscador").value.toLowerCase();
    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        (p.codigoBarra && p.codigoBarra.toLowerCase().includes(texto))
    );
    pintarTabla(filtrados);
}

function abrirModal() {
    productoEditandoId = null;
    document.getElementById("tituloModal").textContent = "Nuevo producto";
    document.getElementById("codigoBarras").readOnly = false;
    document.getElementById("modalProducto").classList.add("activo");
}

function cerrarModal() {
    document.getElementById("modalProducto").classList.remove("activo");
    limpiarFormulario();
}

function guardarProducto() {
    const producto = {
        codigoBarra: document.getElementById("codigoBarras").value.trim(),
        nombre: document.getElementById("nombre").value.trim(),
        cantidad: parseInt(document.getElementById("cantidad").value),
        stockMinimo: parseInt(document.getElementById("stockMinimo").value),
        precio: parseFloat(document.getElementById("precio").value),
        categoria: { id: document.getElementById("categoria").value }
    };

    let url = API_PRODUCTOS;
    let metodo = "POST";

    if (productoEditandoId !== null) {
        url = `${API_PRODUCTOS}/${productoEditandoId}`;
        metodo = "PUT";
    }

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto)
    })
    .then(() => {
        cerrarModal();
        listarProductos();
    });
}

function editarProducto(id) {
    fetch(`${API_PRODUCTOS}/${id}`)
        .then(res => res.json())
        .then(p => {
            document.getElementById("codigoBarras").value = p.codigoBarra ?? "";
            document.getElementById("codigoBarras").readOnly = true;
            document.getElementById("nombre").value = p.nombre;
            document.getElementById("cantidad").value = p.cantidad;
            document.getElementById("stockMinimo").value = p.stockMinimo;
            document.getElementById("precio").value = p.precio;
            document.getElementById("categoria").value = p.categoria?.id || "";
            productoEditandoId = p.id;
            document.getElementById("tituloModal").textContent = "Editar producto";
            document.getElementById("modalProducto").classList.add("activo");
        });
}

function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return;
    fetch(`${API_PRODUCTOS}/${id}`, { method: "DELETE" })
        .then(() => listarProductos());
}

function cargarCategorias() {
    fetch(API_CATEGORIAS)
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById("categoria");
            select.innerHTML = "<option value=''>Seleccione categoría</option>";
            data.forEach(c => {
                select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
            });
        });
}

function limpiarFormulario() {
    document.getElementById("formProducto").reset();
    productoEditandoId = null;
}