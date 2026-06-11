CREATE TABLE usuarios (
    id varchar(50) PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    password_hash varchar(100) NOT NULL,
    edad int NULL,
    experiencia_rubro_credito varchar(100) NULL,
    fecha_registro datetime NOT NULL,
    ultimo_login_fecha datetime NULL
);

CREATE TABLE clientes (
    id varchar(50) PRIMARY KEY,
    id_usuario varchar(50) NOT NULL,
    nombre varchar(150) NOT NULL,
    telefono varchar(30) NULL,
    email varchar(150) NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE presupuestos (
    id varchar(50) PRIMARY KEY,
    id_usuario varchar(50) NOT NULL,
    id_cliente varchar(50) NOT NULL,
    fecha_emision datetime NOT NULL,
    fecha_vencimiento date NOT NULL,
    estado enum("pendiente", "aceptado", "vencido", "rechazado") NOT NULL,
    monto_subtotal decimal(12, 2) NOT NULL,
    descuento decimal(12, 2) DEFAULT 0.00,
    impuestos decimal(12, 2) DEFAULT 0.00,
    recargo decimal(12, 2) DEFAULT 0.00,
    monto_total decimal(12, 2) NOT NULL,
    fecha_ultima_modificacion datetime NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);