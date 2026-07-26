import express from "express"
import controladores from "../controladores/emprendimientos.controladores.js"

const rutasEmprendimientos = express.Router()

rutasEmprendimientos.get("/", controladores.listarEmprendimientos)
rutasEmprendimientos.post("/", controladores.crearEmprendimiento)
rutasEmprendimientos.put("/:id",controladores.editarEmprendimiento)
export default rutasEmprendimientos