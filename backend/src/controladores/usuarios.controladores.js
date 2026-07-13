import servicios from "../servicios/usuarios.servicios.js"

async function traerUsuario(req, res) {
    const idUsuario = req.usuario.id
    const usuario = await servicios.traerUsuario(idUsuario)

    if (usuario) {
        res.status(200).json(usuario)
    } else {
        res.status(200).json([])
    }
}

async function actualizarUsuario(req, res) {
    const idUsuario = req.usuario.id
    const datosUsuario = req.body

    const resultado = await servicios.actualizarUsuario(idUsuario, datosUsuario)

    if (resultado) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se pudo actualizar el usuario."})
    }
}

async function cambiarPassword(req, res) {
    const idUsuario = req.usuario.id
    const datosPassword = req.body

    const resultado = await servicios.cambiarPassword(idUsuario, datosPassword)

    if (resultado) {
        res.status(200).json({mensaje: "Contraseña actualizada correctamente."})
    } else {
        res.status(400).jons({mensaje: "No se pudo actualizar la contraseña."})
    }
}

export default { traerUsuario, actualizarUsuario, cambiarPassword }