import express from "express"
import controladores from "../controladores/auth.controladores.js"

const rutasAuth = express.Router()

<<<<<<< Updated upstream
rutasAuth.post("/login")
rutasAuth.post("/registro")
=======
// La función callback de cada una de estas rutas es de prueba, solo para verificar que el servidor corre correctamente. Luego, 
// cuando tengamos los controladores, las funciones callback se reemplazan por los controladores correspondientes a cada ruta.
rutasAuth.post("/login", controladores.login)
rutasAuth.post("/registro", controladores.registro)
>>>>>>> Stashed changes

export default rutasAuth