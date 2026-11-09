const API_CATEGORIAS = "https://inventario-backend-97dc.onrender.com/api/categorias";

document.addEventListener("DOMContentLoaded", () => {
    listarCategorias();
    iniciarReloj();
});

function iniciarReloj() {
    function actualizar() {
        const ahora = new Date();
        document.getElementById("fechaHora").textContent =
            ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
    }

    actualizar();
    setInterval(actualizar, 1000);
}

function listarCategorias() {
    fetch(API_CATEGORIAS)
        .then(res => {
            if (!res.ok) {
                throw new Error("No se pudieron cargar las categorías");
            }
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("tablaCategorias");
            tbody.innerHTML = "";

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;padding:30px;color:#94a3b8;">Sin categorías registradas</td></tr>`;
                return;
            }

            data.forEach(c => {
                tbody.innerHTML += `
                    <tr>
                        <td>${c.id}</td>
                        <td><strong>${c.nombre}</strong></td>
                        <td>
                            <button class="btn-eliminar" onclick="eliminarCategoria(${c.id})">
                                🗑 Eliminar
                            </button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error("Error al listar categorías:", error);
        });
}

function guardarCategoria() {
    const nombre = document.getElementById("nombreCategoria").value.trim();
    const mensaje = document.getElementById("mensajeCategoria");

    if (!nombre) {
        mensaje.style.color = "#dc2626";
        mensaje.textContent = "Ingrese un nombre";
        return;
    }

    fetch(API_CATEGORIAS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre })
    })
    .then(async res => {
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "No se pudo guardar la categoría");
        }

        return data;
    })
    .then(() => {
        document.getElementById("nombreCategoria").value = "";
        mensaje.style.color = "#16a34a";
        mensaje.textContent = "✅ Categoría guardada";
        setTimeout(() => mensaje.textContent = "", 3000);
        listarCategorias();
    })
    .catch(error => {
        console.error("Error al guardar categoría:", error);
        mensaje.style.color = "#dc2626";
        mensaje.textContent = error.message || "Error conectando con el servidor";
    });
}

function eliminarCategoria(id) {
    if (!confirm("¿Eliminar esta categoría?")) return;

    fetch(`${API_CATEGORIAS}/${id}`, { method: "DELETE" })
        .then(res => {
            if (!res.ok) {
                throw new Error("No se pudo eliminar la categoría");
            }
            listarCategorias();
        })
        .catch(error => {
            console.error("Error al eliminar categoría:", error);
            alert(error.message);
        });
}
