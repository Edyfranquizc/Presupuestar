import servicios from "../servicios/emprendimientos.servicios.js"

async function listarEmprendimientos(req, res) {
    const id_usuario = req.usuario.id
    const resultado = await servicios.listarEmprendimientos(id_usuario)

    if (resultado) {
        res.status(200).json(resultado)
    } else {
        res.status(200).json([])
    }
}

export default { listarEmprendimientos }