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


DELIMITER //

CREATE TRIGGER before_insert_Prestamo
BEFORE INSERT ON Prestamo
FOR EACH ROW
BEGIN
    DECLARE active_count INT;

    -- Contar la cantidad de prestamos activos para el cliente
    SELECT COUNT(*) INTO active_count
    FROM Prestamo
    WHERE id_cliente = NEW.id_cliente AND estado = TRUE;

    -- Si ya hay un prestamo activo, no permitir la inserción
    IF active_count >= 1 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Un cliente no puede tener más de un prestamo activo';
    END IF;
END //

DELIMITER ;
