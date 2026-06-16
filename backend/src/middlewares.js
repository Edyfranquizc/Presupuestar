import express from "express"
import jwt from "jsonwebtoken"
import { promisify } from "util"

const clave = process.env.JWT_SECRET_KEY
const verificar = promisify(jwt.verify)

function manejar404(req, res) {
    res.status(404).json({mensaje: "Verificá la URL y/o el método HTTP."})
}

async function verificarToken(req, res, next) {
    const header = req.headers["authorization"]

    if (header) {
        const token = header.split(" ")[1]

        if (!token) {
            res.status(401).json({mensaje: "No se encontró ningún token."})
        } else {
            try {
                const datos = await verificar(token, clave)
                req.usuario = datos
                next()
            } catch {
                res.status(401).json({mensaje: "El token es inválido."})
            }
        }
    } else {
        res.status(401).json({mensaje: "Esta ruta está protegida. Debe proveerse autenticación."})
    }
}

export default { manejar404 }