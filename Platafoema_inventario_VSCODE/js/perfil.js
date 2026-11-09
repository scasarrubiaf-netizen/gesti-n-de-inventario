
const usuario = localStorage.getItem("usuario");
const rol = localStorage.getItem("rol");

const API_USUARIOS = "https://inventario-backend-97dc.onrender.com/api/usuarios";
const esAdmin = rol === "ADMINISTRADOR" || rol === "ADMIN";

if (!rol || !usuario) {
    window.location.href = "../login.html";
}

// Llenar datos del perfil
document.getElementById("perfilNombre").textContent = usuario;
document.getElementById("perfilUsername").textContent = usuario;
document.getElementById("perfilRol").textContent = esAdmin ? "Administrador" : "Empleado";
document.getElementById("perfilRol2").textContent = esAdmin ? "Administrador" : "Empleado";
document.getElementById("nombreSidebar").textContent = usuario;

// Fecha y hora
function actualizarHora() {
    document.getElementById("fechaHora").textContent =
        new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString();
}

actualizarHora();
setInterval(actualizarHora, 1000);

// Validar requisitos en tiempo real
function validarRequisitos() {
    const nueva = document.getElementById("passwordNueva").value;
    const confirmar = document.getElementById("passwordConfirmar").value;

    const reqLongitud = document.getElementById("req-longitud");
    const reqCoincide = document.getElementById("req-coincide");

    if (nueva.length >= 6) {
        reqLongitud.textContent = "✓ Mínimo 6 caracteres";
        reqLongitud.className = "requisito ok";
    } else {
        reqLongitud.textContent = "○ Mínimo 6 caracteres";
        reqLongitud.className = "requisito fail";
    }

    if (nueva && nueva === confirmar) {
        reqCoincide.textContent = "✓ Las contraseñas coinciden";
        reqCoincide.className = "requisito ok";
    } else {
        reqCoincide.textContent = "○ Las contraseñas coinciden";
        reqCoincide.className = "requisito fail";
    }
}

// Cambiar contraseña
function cambiarPassword() {
    const passwordActual = document.getElementById("passwordActual").value.trim();
    const passwordNueva = document.getElementById("passwordNueva").value.trim();
    const passwordConfirmar = document.getElementById("passwordConfirmar").value.trim();
    const mensaje = document.getElementById("mensajeCambio");

    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
        mensaje.className = "mensaje error";
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    if (passwordNueva.length < 6) {
        mensaje.className = "mensaje error";
        mensaje.textContent = "La contraseña debe tener al menos 6 caracteres";
        return;
    }

    if (passwordNueva !== passwordConfirmar) {
        mensaje.className = "mensaje error";
        mensaje.textContent = "Las contraseñas no coinciden";
        return;
    }

    fetch(`${API_USUARIOS}/cambiar-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: usuario,
            passwordActual,
            passwordNueva
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            mensaje.className = "mensaje error";
            mensaje.textContent = data.error;
        } else {
            mensaje.className = "mensaje ok";
            mensaje.textContent = "✅ Contraseña actualizada correctamente";
            document.getElementById("passwordActual").value = "";
            document.getElementById("passwordNueva").value = "";
            document.getElementById("passwordConfirmar").value = "";
            validarRequisitos();
        }
    })
    .catch(error => {
        console.error("Error al cambiar contraseña:", error);
        mensaje.className = "mensaje error";
        mensaje.textContent = "Error conectando con el servidor";
    });
}

function logout() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    window.location.href = "../login.html";
}

// ===== EVENTOS =====
document.getElementById("passwordNueva").addEventListener("input", validarRequisitos);
document.getElementById("passwordConfirmar").addEventListener("input", validarRequisitos);
document.getElementById("btnGuardar").addEventListener("click", cambiarPassword);
