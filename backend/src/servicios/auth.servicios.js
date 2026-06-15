import modelos from "../modelos/auth.modelos.js"
import { generarToken } from "../token.generator.js"

async function login(email, password) {
    const resultado = await modelos.verificarUsuario(email, password)
    console.log("resultado servicios")
    console.log(resultado)

    if (resultado !== null) {
        const token = generarToken({email: email, password: password, id: resultado[0].id})
        console.log(token)
        return {token, usuario: {id: resultado[0].id, nombre: resultado[0].nombre, email: resultado[0].email}}
    } else {
        return null
    }
}

async function registro(nombre, apellido, email, password) {
    const resultado = await modelos.registrarUsuario(nombre, apellido, email, password)

    if (resultado !== null) {
        const token = generarToken({email: email, password: password, id: resultado[0].id})
        return {token, usuario: {id: resultado[0].id, nombre: resultado[0].nombre, email: resultado[0].email}}
    } else {
        return resultado
    }
}

export default { login, registro }
