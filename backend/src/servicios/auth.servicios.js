import modelos from "../modelos/auth.modelos.js"
import { generarToken } from "../token.generator.js"

async function login(email, password) {
    const resultado = await modelos.verificarUsuario(email, password)

    if (resultado !== null) {
        const token = generarToken({email: email, password: password, id: resultado[0].id})
        return {token, usuario: {id: resultado[0].id, nombre: resultado[0].nombre, email: resultado[0].email}}
    } else {
        return null
    }
}

async function registro(datosUsuario) {
    const resultado = await modelos.registrarUsuario(datosUsuario)

    if (resultado !== null) {
        const token = generarToken({email: email, password: password, id: resultado.id})
        return {token, usuario: {id: resultado.id, nombre: resultado.nombre, email: resultado.email}}
    } else {
        return resultado
    }
}

export default { login, registro }
