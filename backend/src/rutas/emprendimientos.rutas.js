import express from "express"
import controladores from "../controladores/emprendimientos.controladores.js"
import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const rutasEmprendimientos = express.Router()

rutasEmprendimientos.get("/", controladores.listarEmprendimientos)
rutasEmprendimientos.post("/", upload.single("file"), controladores.crearEmprendimiento)

export default rutasEmprendimientos