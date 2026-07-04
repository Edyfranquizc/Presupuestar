import modelos from "../modelos/usuarios.modelos.js"

async function traerUsuario(idUsuario) {
    const usuario = await modelos.traerUsuario(idUsuario)

    if (usuario) {
        return usuario
    } else {
        return null
    }
}