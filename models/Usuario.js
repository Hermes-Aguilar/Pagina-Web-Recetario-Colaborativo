const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: { type: String, unique: true, required: true },
  correoElectronico: { type: String, unique: true, required: true },
  contrasena: { type: String, required: true },
  imagenPerfil: {
    nombreArchivo: String,
    tipo: String,
    almacenadoEn: String
  },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
