import modelos from "../modelos/auth.modelos.js"
import { generarToken } from "../token.generator.js"

async function login(email, password) {
    const resultado = await modelos.verificarUsuario(email, password)

    if (resultado !== null) {
        const token = generarToken({email: email, password: password})
        return {token, usuario: {id, nombre, email}}
    } else {
        return null
    }
}