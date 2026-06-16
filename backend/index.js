import express from "express"
import middlewares from "./src/middlewares.js"
import cors from "cors"

import rutasAuth from "./src/rutas/auth.rutas.js"
import rutasPres from "./src/rutas/presupuestos.rutas.js"

const app = express()
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.json())
app.use("/api/auth", rutasAuth)
app.use("/api/presupuestos", middlewares.verificarToken, rutasPres)
app.use(middlewares.manejar404)

const puerto = 3001
app.listen(puerto, () => {console.log(`Servidor corriendo en http://localhost:${puerto}`)})
