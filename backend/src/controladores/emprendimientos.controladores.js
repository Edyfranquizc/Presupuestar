import servicios from "../servicios/emprendimientos.servicios.js"

async function listarEmprendimientos(req, res) {
    console.log(req)
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
    const buffer = req.file.buffer
    const resultado = await servicios.crearEmprendimiento(datosEmprendimiento, idUsuario, buffer)

    if (resultado) {
        res.status(201).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se pudo crear el emprendimiento."})
    }
}
async function editarEmprendimiento(req, res) {
    console.log(req)
    const datosEmprendimiento = req.body
    const id = req.id
    const buffer = req.file.buffer
    const callback = (error, resultado) => {
        if (resultado) {
            res.status(201).json(resultado)
        } else {
            res.status(400).json({mensaje: "No se pudo editar el presupuesto."})
        }}
        const resultado = await servicios.editarEmprendimiento(datosEmprendimiento, id,buffer, callback)
    }
export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }