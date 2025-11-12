/*CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(50) UNIQUE,
    correoElectronico VARCHAR(100) UNIQUE,
    contrasena VARCHAR(255),
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreProducto VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    stock INT,
    /*fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP*/
)
*/

CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreUsuario VARCHAR(50) UNIQUE NOT NULL,
    correoElectronico VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombreProducto VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10, 2),
    stock INT DEFAULT 0,
    imagenNombreArchivo VARCHAR(255), -- nombre del archivo subido
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuarioId INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    FOREIGN KEY (usuarioId) REFERENCES Usuarios(id)
);

CREATE TABLE DetallePedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedidoId INT,
    productoId INT,
    cantidad INT,
    precioUnitario DECIMAL(10,2),
    FOREIGN KEY (pedidoId) REFERENCES Pedidos(id),
    FOREIGN KEY (productoId) REFERENCES Productos(id)
);

