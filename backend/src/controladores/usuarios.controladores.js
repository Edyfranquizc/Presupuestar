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

export default { traerUsuario }