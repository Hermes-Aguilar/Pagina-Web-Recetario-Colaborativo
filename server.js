const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Usuario = require('./models/Usuario');
const Receta = require('./models/Receta');
const Valoracion = require('./models/Valoracion');
const BlogConsejo = require('./models/BlogConsejo');
const ComentarioBlog = require('./models/ComentarioBlog');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Conexión a Mongo
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// =====================
// RUTAS DE USUARIOS
// =====================

// Crear usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un usuario por nombre
app.get('/api/usuarios/:nombreUsuario', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombreUsuario: req.params.nombreUsuario });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar usuario
app.put('/api/usuarios/:nombreUsuario', async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { nombreUsuario: req.params.nombreUsuario },
      req.body,
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// RUTAS DE RECETAS
// =====================

// Crear receta
app.post('/api/recetas', async (req, res) => {
  try {
    const receta = new Receta(req.body);
    await receta.save();
    res.json(receta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener recetas con filtros dinámicos
app.get('/api/recetas', async (req, res) => {
  try {
    const filtros = {};

    // filtro por tipo
    if (req.query.tipo) {
      filtros.tipo = req.query.tipo;
    }

    // filtro por usuario
    if (req.query.usuario) {
      filtros.usuario = req.query.usuario;
    }

    // búsqueda por título (parcial, insensible a mayúsculas)
    if (req.query.titulo) {
      filtros.titulo = { $regex: req.query.titulo, $options: "i" };
    }

    // filtro por ingrediente (el ingrediente puede estar dentro del array)
    if (req.query.ingrediente) {
      filtros.ingredientes = { $in: [ req.query.ingrediente ] };
    }

    const recetas = await Receta.find(filtros);
    res.json(recetas);

  } catch (err) {
    res.status(500).json({ error: "Error al filtrar recetas" });
  }
});

// Obtener una receta por título
app.get('/api/recetas/:titulo', async (req, res) => {
  try {
    const receta = await Receta.findOne({ titulo: req.params.titulo });
    if (!receta) {
      return res.status(404).json({ error: 'Receta no encontrada' });
    }
    res.json(receta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar una receta a favoritos
app.post("/api/usuarios/:usuario/favoritos/:idReceta", async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { nombreUsuario: req.params.usuario },
      { $addToSet: { favoritos: req.params.idReceta } }, // evita duplicados
      { new: true }
    );

    res.json({
      mensaje: "Receta agregada a favoritos",
      favoritos: usuario.favoritos
    });
  } catch (err) {
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// Eliminar una receta de favoritos

app.delete("/api/usuarios/:usuario/favoritos/:idReceta", async (req, res) => {
  try {
    const usuario = await Usuario.findOneAndUpdate(
      { nombreUsuario: req.params.usuario },
      { $pull: { favoritos: req.params.idReceta } },
      { new: true }
    );

    res.json({
      mensaje: "Receta eliminada de favoritos",
      favoritos: usuario.favoritos
    });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

// Obtener todas las recetas favoritas del usuario

app.get("/api/usuarios/:usuario/favoritos", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombreUsuario: req.params.usuario })
      .populate("favoritos"); // <-- convierte IDs a recetas completas

    res.json(usuario.favoritos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});


// =====================
// RUTAS DE VALORACIONES
// =====================

// Crear valoración
app.post('/api/valoraciones', async (req, res) => {
  try {
    const valoracion = new Valoracion(req.body);
    await valoracion.save();
    res.json(valoracion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todas las valoraciones
app.get('/api/valoraciones', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find();
    res.json(valoraciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener valoraciones de una receta específica
app.get('/api/valoraciones/:recetaTitulo', async (req, res) => {
  try {
    const valoraciones = await Valoracion.find({ recetaTitulo: req.params.recetaTitulo });
    res.json(valoraciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// RUTAS DE BLOGS
// =====================

// Crear blog de consejo
app.post('/api/blogs', async (req, res) => {
  try {
    const blog = new BlogConsejo(req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los blogs de consejos
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await BlogConsejo.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener un blog por título
app.get('/api/blogs/:titulo', async (req, res) => {
  try {
    const blog = await BlogConsejo.findOne({ titulo: req.params.titulo });
    if (!blog) {
      return res.status(404).json({ error: 'Blog no encontrado' });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// RUTAS DE COMENTARIOS DE BLOG
// =====================

// Crear comentario en blog
app.post('/api/comentariosBlog', async (req, res) => {
  try {
    const comentario = new ComentarioBlog(req.body);
    await comentario.save();
    res.json(comentario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los comentarios
app.get('/api/comentariosBlog', async (req, res) => {
  try {
    const comentarios = await ComentarioBlog.find();
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener comentarios de un blog específico
app.get('/api/comentariosBlog/:titulo', async (req, res) => {
  try {
    const comentarios = await ComentarioBlog.find({ blogTitulo: req.params.titulo });
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// RUTA DE PRUEBA
// =====================
app.get('/', (req, res) => {
  res.json({ 
    message: '¡API de RedRecetas funcionando!',
    endpoints: {
      usuarios: '/api/usuarios',
      recetas: '/api/recetas',
      valoraciones: '/api/valoraciones',
      blogs: '/api/blogs',
      comentariosBlog: '/api/comentariosBlog'
    }
  });
});

// Agregar este código en server.js después de las rutas de usuarios existentes
// =====================
// RUTA DE AUTENTICACIÓN
// =====================

/**
 * Login de usuario
 * POST /api/auth/login
 * Body: { username: string, password: string }
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que se envíen los datos
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Usuario y contraseña son requeridos' 
      });
    }

    // Buscar usuario por nombreUsuario o correoElectronico
    const usuario = await Usuario.findOne({
      $or: [
        { nombreUsuario: username },
        { correoElectronico: username }
      ]
    });

    // Usuario no encontrado
    if (!usuario) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Verificar contraseña
    // NOTA: En producción, deberías usar bcrypt para comparar hashes
    // Ejemplo con bcrypt:
    // const bcrypt = require('bcrypt');
    // const passwordMatch = await bcrypt.compare(password, usuario.contrasena);
    
    if (usuario.contrasena !== password) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas',
        mensaje: 'Usuario o contraseña incorrectos'
      });
    }

    // Login exitoso - NO enviar la contraseña en la respuesta
    const usuarioRespuesta = {
      nombreUsuario: usuario.nombreUsuario,
      correoElectronico: usuario.correoElectronico,
      imagenPerfil: usuario.imagenPerfil,
      fechaRegistro: usuario.fechaRegistro
    };

    res.json({
      mensaje: 'Login exitoso',
      usuario: usuarioRespuesta
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ 
      error: 'Error en el servidor',
      mensaje: 'Ocurrió un error al procesar tu solicitud'
    });
  }
});

/**
 * Verificar sesión
 * POST /api/auth/verify
 * Body: { nombreUsuario: string }
 */
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { nombreUsuario } = req.body;

    if (!nombreUsuario) {
      return res.status(400).json({ 
        error: 'Nombre de usuario requerido' 
      });
    }

    const usuario = await Usuario.findOne({ nombreUsuario });

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Retornar datos del usuario sin contraseña
    const usuarioRespuesta = {
      nombreUsuario: usuario.nombreUsuario,
      correoElectronico: usuario.correoElectronico,
      imagenPerfil: usuario.imagenPerfil,
      fechaRegistro: usuario.fechaRegistro
    };

    res.json({
      valido: true,
      usuario: usuarioRespuesta
    });

  } catch (err) {
    console.error('Error al verificar sesión:', err);
    res.status(500).json({ 
      error: 'Error en el servidor' 
    });
  }
});

/**
 * OPCIONAL: Cambiar contraseña
 * PUT /api/auth/change-password
 * Body: { nombreUsuario: string, oldPassword: string, newPassword: string }
 */
app.put('/api/auth/change-password', async (req, res) => {
  try {
    const { nombreUsuario, oldPassword, newPassword } = req.body;

    if (!nombreUsuario || !oldPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }

    const usuario = await Usuario.findOne({ nombreUsuario });

    if (!usuario) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña actual
    if (usuario.contrasena !== oldPassword) {
      return res.status(401).json({ 
        error: 'Contraseña actual incorrecta' 
      });
    }

    // Actualizar contraseña
    // En producción, usar bcrypt:
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.contrasena = newPassword;
    await usuario.save();

    res.json({ 
      mensaje: 'Contraseña actualizada exitosamente' 
    });

  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ 
      error: 'Error en el servidor' 
    });
  }
});

// =====================
// INICIO SERVIDOR
// =====================
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
