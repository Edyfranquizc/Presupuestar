import express from "express"

const rutasAuth = express.Router()

// La función callback de cada una de estas rutas es de prueba, solo para verificar que el servidor corre correctamente. Luego, 
// cuando tengamos los controladores, las funciones callback se reemplazan por los controladores correspondientes a cada ruta.
rutasAuth.post("/login", (req, res) => {res.status(200).json({mensaje: "prueba login"})})
rutasAuth.post("/registro", (req, res) => {res.status(200).json({mensaje: "prueba registro"})})

export default rutasAuth