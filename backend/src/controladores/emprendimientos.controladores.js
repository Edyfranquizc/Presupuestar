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

async function crearEmprendimiento(req, res) {
    const datosEmprendimiento = req.body
    const idUsuario = req.usuario.id
    const resultado = await servicios.crearEmprendimiento(datosEmprendimiento, idUsuario)

    if (resultado) {
        res.status(201).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se pudo crear el presupuesto."})
    }
}

export default { listarEmprendimientos, crearEmprendimiento }