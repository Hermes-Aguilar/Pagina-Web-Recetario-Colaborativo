/*db = db.getSiblingDB('Receta');
db = db.getSiblingDB('Estrellas');
db = db.getSiblingDB('BlogConsejos');
db = db.getSiblingDB('Opiniones');
db = db.getSiblingDB('FotoUsuario');

db.Receta.insertOne({
    usuario: "@gamer",
    imagen: "https://example.com/imagen-gaming.jpg",
    ingredientes: "Pasta",
    texto: "Perfecto para gaming, muy cómodo",
    estrellas: 5/*calcular con base en la colección Estrellas*//*,
    fecha: new Date()
});

db.Estrellas.insertOne({
    usuario: "@gamer",
    estrellas: 5, 
});

db.BlogConsejos.insertOne({
    titulo: "Mejores snacks para gamers",
    contenido: "Aquí te dejo una lista de snacks ideales para largas sesiones de juego...",
    autor: "@gamer",
    fecha: new Date()
});

db.Opiniones.insertOne({
    usuario: "@gamer",
    BlogConsejo: "Silla Gamer XYZ",/*Gato referenciando el BlogConsejo*//*
    texto: "Muy cómoda y ajustable, perfecta para largas sesiones de juego.",
});

db.FotoUsuario.insertOne({
    usuario: "@gamer",
    imagen: "https://example.com/foto-gamer.jpg"
});*/

//use RedRecetas;

// Usuario con imagen de perfil subida
db.Usuarios.insertOne({
    nombreUsuario: "@chefLuis",
    correoElectronico: "chef@example.com",
    imagenPerfil: {
        nombreArchivo: "perfil_chefLuis.jpg",
        tipo: "image/jpeg",
        almacenadoEn: "uploads/perfiles/"
    },
    fechaRegistro: new Date()
});

// Receta con imagen subida
db.Recetas.insertOne({
    usuario: "@chefLuis",
    titulo: "Pasta energética",
    ingredientes: ["Pasta", "Tomate", "Queso"],
    descripcion: "Ideal para gamers",
    imagen: {
        nombreArchivo: "pasta_energetica.jpg",
        tipo: "image/jpeg",
        almacenadoEn: "uploads/recetas/"
    },
    fecha: new Date()
});

// Valoración de receta
db.Valoraciones.insertOne({
    recetaTitulo: "Pasta energética",
    usuario: "@gamer",
    estrellas: 5,
    comentario: "Perfecta para sesiones largas",
    fecha: new Date()
});

// Blog y opinión
db.BlogConsejos.insertOne({
    autor: "@chefLuis",
    titulo: "Snacks para mantener energía",
    contenido: "Frutos secos, batidos, y más...",
    fecha: new Date()
});

db.OpinionesBlog.insertOne({
    blogTitulo: "Snacks para mantener energía",
    usuario: "@gamer",
    texto: "Muy útil para mis streams",
    fecha: new Date()
});