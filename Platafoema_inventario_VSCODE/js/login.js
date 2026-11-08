let rolSeleccionado = "";

function seleccionarRol(rol, btn) {
    rolSeleccionado = rol;

    document.querySelectorAll(".btn-rol").forEach(b => b.classList.remove("seleccionado"));
    btn.classList.add("seleccionado");

    document.getElementById("formLogin").classList.add("visible");
    document.getElementById("tituloForm").textContent =
        rol === "ADMIN" ? "🔐 Acceso Administrador" : "👤 Acceso Empleado";
    document.getElementById("username").focus();
    document.getElementById("errorMsg").textContent = "";
}

function volverOpciones() {
    rolSeleccionado = "";
    document.querySelectorAll(".btn-rol").forEach(b => b.classList.remove("seleccionado"));
    document.getElementById("formLogin").classList.remove("visible");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("errorMsg").textContent = "";
}

function iniciarSesion() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");

    if (!rolSeleccionado) {
        errorMsg.textContent = "Selecciona un tipo de acceso";
        return;
    }

    if (!username || !password) {
        errorMsg.textContent = "Completa todos los campos";
        return;
    }

    errorMsg.textContent = "";

    fetch("https://inventario-backend-97dc.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            errorMsg.textContent = data.error;
            return;
        }

        if (data.rol !== rolSeleccionado) {
            errorMsg.textContent = "No tienes acceso como " +
                (rolSeleccionado === "ADMIN" ? "Administrador" : "Empleado");
            return;
        }

        localStorage.setItem("usuario", data.username);
        localStorage.setItem("rol", data.rol);

        if (data.rol === "ADMIN") {
            window.location.href = "pages/dashboard.html";
        } else {
            window.location.href = "pages/ventas.html";
        }
    })
    .catch(() => {
        errorMsg.textContent = "Error conectando con el servidor";
    });
}