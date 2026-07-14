import modelos from "../modelos/usuarios.modelos.js"

async function traerUsuario(idUsuario) {
    const usuario = await modelos.traerUsuario(idUsuario)

    if (usuario) {
        return usuario
    } else {
        return null
    }
}

async function actualizarUsuario(idUsuario, datosUsuario) {
    const resultado = await modelos.actualizarUsuario(idUsuario, datosUsuario)

    if (resultado) {
        return resultado
    } else {
        return null
    }
}

async function cambiarPassword(idUsuario, datosPassword) {
    const resultado = await modelos.cambiarPassword(idUsuario, datosPassword)

    if (resultado) {
        return true
    } else {
        return null
    }
}

export default { traerUsuario, actualizarUsuario, cambiarPassword }