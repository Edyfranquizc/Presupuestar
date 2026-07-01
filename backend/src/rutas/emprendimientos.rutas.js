import express from "express"
import controladores from "../controladores/emprendimientos.controladores.js"

const rutasEmprendimientos = express.Router()

rutasEmprendimientos.get("/", listarEmprendimientos)
rutasEmprendimientos.post("/", crearEmprendimiento)

export { rutasEmprendimientos }