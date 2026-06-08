import express from "express"
import middlewares from "./src/middlewares.js"

import rutasAuth from "./src/rutas/auth.rutas.js"

const app = express()

app.use(express.json())
app.use("/auth", rutasAuth)
app.use(middlewares.manejar404)

const puerto = 3001
app.listen(puerto, () => {console.log(`Servidor corriendo en http://localhost:${puerto}`)})
