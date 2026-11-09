
const API_URL = "https://inventario-backend-97dc.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    cargarDashboard();
    mostrarFechaHora();
    setInterval(mostrarFechaHora, 1000);
    cargarEmpleados();
});

function cargarDashboard() {
    fetch(`${API_URL}/api/dashboard`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalProductos").textContent = data.totalProductos;
            document.getElementById("totalCategorias").textContent = data.totalCategorias;
            document.getElementById("totalMovimientos").textContent = data.totalMovimientos;
            document.getElementById("stockTotal").textContent = data.stockTotal;
        })
        .catch(error => console.error("Error dashboard:", error));
}

function mostrarFechaHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

function registrarEmpleado() {
    const username = document.getElementById("nuevoUsername").value.trim();
    const password = document.getElementById("nuevoPassword").value.trim();
    const mensaje = document.getElementById("mensajeRegistro");

    if (!username || !password) {
        mensaje.className = "mensaje-error";
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            mensaje.className = "mensaje-error";
            mensaje.textContent = "Error: " + data.error;
        } else {
            mensaje.className = "mensaje-ok";
            mensaje.textContent = "✅ Empleado registrado correctamente";
            document.getElementById("nuevoUsername").value = "";
            document.getElementById("nuevoPassword").value = "";
            cargarEmpleados();
        }
    })
    .catch(() => {
        mensaje.className = "mensaje-error";
        mensaje.textContent = "Error conectando con el servidor";
    });
}

function cargarEmpleados() {
    fetch(`${API_URL}/api/usuarios`)
        .then(res => res.json())
        .then(usuarios => {
            const tbody = document.getElementById("tablaEmpleados");
            tbody.innerHTML = "";

            usuarios.forEach((u, i) => {
                const activo = u.activo !== false;
                const badgeClass = activo ? "activo" : "inactivo";
                const badgeTexto = activo ? "✅ Activo" : "⛔ Inactivo";
                const btnToggle = activo ? "⛔ Desactivar" : "✅ Activar";

                tbody.innerHTML += `
                    <tr>
                        <td>${i + 1}</td>
                        <td><strong>${u.username}</strong></td>
                        <td>${u.rol ? u.rol.nombre : '-'}</td>
                        <td>
                            <span class="badge-activo ${badgeClass}">${badgeTexto}</span>
                        </td>
                        <td>
                            <button class="btn-accion"
                                onclick="abrirEditar(${u.id}, '${u.username}')">
                                ✏️ Editar
                            </button>
                            <button class="btn-accion"
                                onclick="toggleEmpleado(${u.id})">
                                ${btnToggle}
                            </button>
                        </td>
                    </tr>
                `;
            });
        });
}
