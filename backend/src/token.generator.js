import jwt from "jsonwebtoken"
import "dotenv/config"

const clave = process.env.JWT_SECRET_KEY

export function generarToken(usuario) {
    const { email, password, id } = usuario
    const usuario_token = {id, email}
    const expiracion = { expiresIn: "1h" }

    return jwt.sign(usuario_token, clave, expiracion)
}
