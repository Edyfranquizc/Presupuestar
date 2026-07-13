import express from "express"
import controladores from "../controladores/usuarios.controladores.js"

const rutasUsuarios = express.Router()

rutasUsuarios.get("/me", controladores.traerUsuario)
rutasUsuarios.put("/me", controladores.actualizarUsuario)
rutasUsuarios.put("/me/password", controladores.cambiarPassword)

export default rutasUsuarios