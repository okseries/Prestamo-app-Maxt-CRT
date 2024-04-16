-- DROP AND CREATE DATABASE
DROP DATABASE IF EXISTS FINANCIERA_APP;
CREATE DATABASE FINANCIERA_APP;
USE FINANCIERA_APP;

CREATE TABLE Usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_correo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    clave VARCHAR(25) NOT NULL,
    estado BOOLEAN DEFAULT TRUE
);


CREATE TABLE Cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    identificacion VARCHAR(16) NOT NULL UNIQUE,
    primer_nombre VARCHAR(25) NOT NULL,
    segundo_nombre VARCHAR(25),
    apellido_paterno VARCHAR(25) NOT NULL,
    apellido_materno VARCHAR(25),
    telefono VARCHAR(15) NOT NULL,
    correo VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    ingresos DECIMAL(10,2) NOT NULL,
    donde_labora VARCHAR(50),
    estado BOOLEAN DEFAULT TRUE
);

CREATE TABLE Prestamo (
    id_prestamo INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT NOT NULL,
    capital DECIMAL(10,2) NOT NULL,
    tasa_porcentaje DECIMAL(5,2) NOT NULL,
    tiempo INT NOT NULL,
    interes DECIMAL(10,2) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    cuota DECIMAL(10,2) NOT NULL,
    monto_restante DECIMAL(10,2),
    estado BOOLEAN DEFAULT TRUE,
    frecuencia_pago VARCHAR(15) NOT NULL,
    fecha_inicio DATE NULL,
    fecha_fin DATE NULL,
    FOREIGN KEY (id_cliente) REFERENCES Cliente (id) ON UPDATE CASCADE
);

CREATE TABLE Pago (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_prestamo INT NOT NULL,
    fecha_pago DATE NOT NULL,
    monto_pago DECIMAL(10,2) NOT NULL,
    estado VARCHAR(10) DEFAULT 'Aplicado', -- Aplicado o Cancelado
    FOREIGN KEY (id_prestamo) REFERENCES Prestamo (id_prestamo) ON UPDATE CASCADE
);

CREATE TABLE Amortizacion (
    id_amortizacion INT PRIMARY KEY AUTO_INCREMENT,
    id_prestamo INT NOT NULL,
    numero_cuota INT NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    monto_cuota DECIMAL(10,2) NOT NULL,
    capital_pagado DECIMAL(10,2) NOT NULL,
    interes_pagado DECIMAL(10,2) NOT NULL,
    saldo_restante DECIMAL(10,2) NOT NULL,
    estado VARCHAR(15) DEFAULT 'Inconcluso', -- Inconcluso o Concluido
    FOREIGN KEY (id_prestamo) REFERENCES Prestamo (id_prestamo) ON UPDATE CASCADE ON DELETE CASCADE
);


INSERT INTO `sucursal` (`idSucursal`, `nombreSucursal`, `estadoSucursal`, `createdAt`, `updatedAt`) 
VALUES (NULL, 'Recomunicaciones', '1', '2024-04-16 01:04:03.000000', '2024-04-16 01:04:03.000000');


INSERT INTO `usuario` (`idUsuario`, `usuarioCorreo`, `nombre`, `clave`, `estado`, `idSucursal`, `createdAt`, `updatedAt`) 
VALUES (NULL, 'malfryrd@gmail.com', 'Malfry N. Perez', '12345678', '1', '1', '2024-04-16 01:05:40.000000', '2024-04-16 01:05:40.000000');


INSERT INTO `frecuenciapago` (`idFrecuencia`, `descripcion`, `createdAt`, `updatedAt`) 
VALUES (NULL, 'Mensual', '2024-04-16 01:06:41.000000', '2024-04-16 01:06:41.000000'),
 (NULL, 'Quincenal', '2024-04-16 01:06:41.000000', '2024-04-16 01:06:41.000000'),
  (NULL, 'Semanal', '2024-04-16 01:06:41.000000', '2024-04-16 01:06:41.000000'), 
  (NULL, 'Diario', '2024-04-16 01:06:41.000000', '2024-04-16 01:06:41.000000');