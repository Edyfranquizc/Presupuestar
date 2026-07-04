import express from "express"

const rutasUsuarios = express.Router()

rutasUsuarios.get("/me", traerUsuario)
rutasUsuarios.put("/me", actualizarUsuario)

export default rutasUsuarios