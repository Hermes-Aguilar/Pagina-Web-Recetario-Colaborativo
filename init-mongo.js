db = db.getSiblingDB("RedRecetas");
/*
// Limpiar colecciones existentes si ya existen
try { db.usuarios.drop(); } catch(e) {}
try { db.recetas.drop(); } catch(e) {}
try { db.valoraciones.drop(); } catch(e) {}
try { db.blogs.drop(); } catch(e) {}
try { db.comentariosblogs.drop(); } catch(e) {}*/

// Insertar usuarios
db.usuarios.insertMany([
  { 
    nombreUsuario: "@chefLuis", 
    correoElectronico: "chef@example.com", 
    contrasena: "123456",
    imagenPerfil: {
      nombreArchivo: "perfil_chefLuis.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/perfiles/"
    }
  },
  { 
    nombreUsuario: "@gamer", 
    correoElectronico: "gamer@example.com", 
    contrasena: "654321",
    imagenPerfil: {
      nombreArchivo: "perfil_gamer.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/perfiles/"
    }
  }
]);

// Insertar recetas
db.recetas.insertMany([
  { 
    usuario: "@chefLuis", 
    titulo: "Pasta energética",
    tipo: "Cena",
    ingredientes: ["Pasta", "Tomate", "Queso"], 
    descripcion: "Ideal para gamers",
    pasos: "Lavar las frutas, luego desinfectar los tomatos/n salir",
    imagen: {
      nombreArchivo: "pasta_energetica.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/recetas/"
    }
  },
  { 
    usuario: "@chefLuis", 
    titulo: "Ensalada gamer",
    tipo: "Almuerzo",
    ingredientes: ["Lechuga", "Tomate", "Pollo", "Aguacate"], 
    descripcion: "Saludable y rápida",
    pasos: "Lavar las frutas, luego desinfectar los tomatos/n salir",
    imagen: {
      nombreArchivo: "ensalada_gamer.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/recetas/"
    }
  }
]);

// Insertar valoraciones
db.valoracions.insertMany([
  {
    recetaTitulo: "Pasta energética",
    usuario: "@gamer",
    estrellas: 5,
    comentario: "Perfecta para sesiones largas"
  },
  {
    recetaTitulo: "Ensalada gamer",
    usuario: "@gamer",
    estrellas: 4,
    comentario: "Muy fresca y nutritiva"
  }
]);

// Insertar blogs
db.blogconsejos.insertMany([
  {
    autor: "@chefLuis",
    titulo: "Snacks para mantener energía",
    imagen: {
      nombreArchivo: "ensalada_gamer.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/recetas/"
    },
    contenido: "Frutos secos, batidos, y más. Mantén tu energía durante largas sesiones de juego con estos consejos nutricionales."
  },
  {
    autor: "@chefLuis",
    titulo: "Hidratación para gamers",
    imagen: {
      nombreArchivo: "ensalada_gamer.jpg",
      tipo: "image/jpeg",
      almacenadoEn: "uploads/recetas/"
    },
    contenido: "El agua es esencial. Aprende cuánto y cuándo beber para mantenerte en tu mejor forma."
  }
]);

// Insertar comentarios de blog
db.comentarioblogs.insertMany([
  {
    blogTitulo: "Snacks para mantener energía",
    usuario: "@gamer",
    texto: "Muy útil para mis streams"
  },
  {
    blogTitulo: "Hidratación para gamers",
    usuario: "@gamer",
    texto: "Excelente consejo, me ayudó mucho"
  }
]);

print("✅ Base de datos inicializada correctamente con datos de prueba");
