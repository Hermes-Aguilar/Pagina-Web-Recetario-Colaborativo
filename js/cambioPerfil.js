document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".profile-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombreUsuario: document.getElementById("dish-name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      imagen: document.getElementById("profilePreview").src
    };

    try {
      const res = await fetch("http://localhost:3000/api/usuarios/" + data.nombreUsuario, {
        method: "PUT", // actualización
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert("Perfil actualizado ✅");
      console.log(result);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
    }
  });
});
