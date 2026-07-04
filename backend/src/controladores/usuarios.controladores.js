import servicios from "../servicios/usuarios.servicios.js"

async function traerUsuario(req, res) {
    const idUsuario = req.usuario.id
    console.log(idUsuario)
    const usuario = await servicios.traerUsuario(idUsuario)

    if (usuario) {
        console.log("usuario traido")
        res.status(200).json(usuario)
    } else {
        res.status(200).json([])
    }
}

export default { traerUsuario }