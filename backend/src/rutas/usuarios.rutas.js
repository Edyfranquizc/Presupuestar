import express from "express"
import controladores from "../controladores/usuarios.controladores.js"

const rutasUsuarios = express.Router()

rutasUsuarios.get("/me", controladores.traerUsuario)
// rutasUsuarios.put("/me", controladores.actualizarUsuario)

export default rutasUsuarios