document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".button");

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const data = {
      titulo: document.getElementById("tituloc").value,
      contenido: document.getElementById("contenidoc").value,
      imagen: document.getElementById("subirimagen").files[0]?.name || "",
      usuario: "302-B" // usuario logueado
    };

    try {
      const res = await fetch("http://localhost:3000/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert("Blog publicado con éxito ✅");
      console.log(result);
    } catch (err) {
      console.error("Error al crear blog:", err);
    }
  });
});
