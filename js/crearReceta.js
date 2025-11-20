document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-publicar");

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const data = {
      tipo: document.getElementById("meal-type").value,
      titulo: document.getElementById("dish-name").value,
      ingredientes: document.getElementById("ingredients").value.split("\n"), // cada línea como ingrediente
      descripcion: document.getElementById("description").value,
      usuario: "302-B" // aquí podrías poner el usuario logueado
    };

    try {
      const res = await fetch("http://localhost:3000/api/recetas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      alert("Receta creada con éxito ✅");
      console.log(result);
    } catch (err) {
      console.error("Error al crear receta:", err);
    }
  });
});
