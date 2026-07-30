CREATE TABLE usuarios (
    id varchar(50) PRIMARY KEY,
    nombre varchar(100) NOT NULL,
    apellido varchar(100) NOT NULL,
    email varchar(150) NOT NULL UNIQUE,
    password_hash varchar(100) NOT NULL,
    fecha_nacimiento date NULL,
    experiencia_rubro_credito varchar(100) NULL,
    fecha_registro datetime NOT NULL,
    ultimo_login_fecha datetime NULL,
    ubicacion varchar(255) NULL,
    celular varchar(255) NOT NULL DEFAULT '0',
    dni varchar(255) NULL DEFAULT '0'
);

CREATE TABLE emprendimientos (
    id varchar(50) PRIMARY KEY,
    id_usuario varchar(50) NOT NULL,
    nombre varchar(50) NULL,
    rubro varchar(50) NULL,
    moneda varchar(50) NULL,
    cuit varchar(50) NULL,
    logo_url varchar(300) NULL,
    email_comercial varchar(255) NOT NULL,
    whatsapp varchar(255) NOT NULL,
    web varchar(255) NULL,
    instagram varchar(255) NULL,
    facebook varchar(255) NULL,

    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
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
    id_emprendimiento varchar(50) NOT NULL,
    fecha_creacion datetime NOT NULL,
    fecha_vencimiento date NOT NULL,
    fecha_ultima_modificacion datetime NULL,
    fecha_ultima_visualizacion datetime NULL,
    estado enum('pendiente', 'aceptado', 'vencido', 'rechazado') NOT NULL,
    numero varchar(255) NOT NULL,
    cliente_nombre varchar(255) NOT NULL,
    cliente_email varchar(255) NULL,
    cliente_telefono varchar(255) NULL,
    subtotal decimal(12, 2) NOT NULL,
    descuento_tipo enum('porcentaje', 'monto_fijo') NULL,
    descuento_valor decimal(12, 2) NULL DEFAULT 0.00,
    descuento_monto decimal(10, 2) NULL,
    base_imponible decimal(10, 2) NULL,
    iva_porcentaje varchar(255) NULL,
    iva_monto varchar(255) NULL,
    impuestos decimal(12, 2) NULL DEFAULT 0.00,
    recargo decimal(12, 2) NULL DEFAULT 0.00,
    total decimal(12, 2) NOT NULL,
    notas varchar(255) NULL,
    url_pdf varchar(255) NULL,
    contador_visualizaciones int NULL DEFAULT 0,

    FOREIGN KEY (id_emprendimiento) REFERENCES emprendimientos(id)
);

CREATE TABLE items_presupuesto (
    id_item varchar(50) PRIMARY KEY,
    id_presupuesto varchar(50) NOT NULL,
    nombre varchar(255) NULL,
    descripcion varchar(255) NOT NULL,
    cantidad int NOT NULL,
    precio_unitario decimal(10, 0) NOT NULL,
    subtotal decimal(10, 0) NOT NULL,

    FOREIGN KEY (id_presupuesto) REFERENCES presupuestos(id)
);