1. Qué quieres lograr (explicación simple)

La colección Usuarios guarda una lista de las recetas que creó cada usuario, pero solo guarda los IDs de esas recetas, así:

{
  "_id": "usuarioID",
  "nombre": "@chefLuis",
  "recetas": [
    "idReceta1",
    "idReceta2",
    "idReceta3"
  ]
}

La colección Recetas guarda la información completa de cada receta:

{
  "_id": "idReceta1",
  "titulo": "Pasta energética",
  "ingredientes": [ ... ],
  ...
}

2. Cómo modificar tu modelo Usuario para agregar el array de IDs

En models/Usuario.js, agrega:

recetas: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receta"
  }
]

Tu modelo queda así (solo muestro la parte importante):

const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: String,
  correoElectronico: String,
  contrasena: String,

  recetas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Receta"
    }
  ]
});

3. Al crear una receta, también la agregamos al usuario

En tu endpoint POST /api/recetas:

app.post('/api/recetas', async (req, res) => {
  try {
    const nueva = await Receta.create(req.body);

    // Agregar el ID de la receta al usuario
    await Usuario.findOneAndUpdate(
      { nombreUsuario: req.body.usuario },
      { $push: { recetas: nueva._id } }
    );

    res.json(nueva);
  } catch (err) {
    res.status(500).json({ error: "Error al crear receta" });
  }
});

4. Cómo obtener las recetas de un usuario (autodespliegue)

En tu endpoint:

app.get("/api/usuarios/:usuario/recetas", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombreUsuario: req.params.usuario })
      .populate("recetas");   // <--- Esto hace la magia

    res.json(usuario.recetas);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener recetas del usuario" });
  }
});
