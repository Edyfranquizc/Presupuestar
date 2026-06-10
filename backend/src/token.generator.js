import jwt from "jsonwebtoken"
import "dotenv/config"

const clave = process.env.JWT_SECRET_KEY

export function generarToken(usuario) {
    const { email, password } = usuario
    const usuario = {id, email}
    const expiracion = { expiresIn: "1h" }

    return jwt.sign(usuario, clave, expiracion)
}
