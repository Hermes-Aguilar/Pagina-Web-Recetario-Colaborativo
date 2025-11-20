document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener campos
        const nombreCompleto = document.getElementById("fullname").value.trim();
        const correo = document.getElementById("email").value.trim();
        const usuario = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const confirmar = document.getElementById("confirm-password").value;

        // Validar contraseñas
        if (password !== confirmar) {
            alert("⚠️ Las contraseñas no coinciden.");
            return;
        }

        // Crear objeto EXACTO como tu backend lo espera
        const nuevoUsuario = {
            nombreUsuario: usuario,
            correoElectronico: correo,
            contrasena: password
        };

        try {
            const respuesta = await fetch("http://localhost:3000/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(nuevoUsuario)
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("🎉 Usuario registrado exitosamente");
                window.location.href = "login.html";
            } else {
                alert("❌ Error: " + data.error);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("❌ No se pudo conectar al servidor.");
        }

    });

});
