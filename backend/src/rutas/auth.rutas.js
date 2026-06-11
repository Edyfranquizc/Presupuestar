import express from "express"
import controladores from "../controladores/auth.controladores.js"

const rutasAuth = express.Router()

rutasAuth.post("/login", controladores.login)
rutasAuth.post("/registro", controladores.registro)

export default rutasAuth