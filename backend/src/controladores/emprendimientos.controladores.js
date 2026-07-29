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
    const buffer = req.file ? req.file.buffer : null

    const callback = (error, resultado) => {
        if (resultado) {
            res.status(201).json(resultado)
        } else {
            res.status(400).json({mensaje: "No se pudo crear el emprendimiento."})
        }
    }

    const resultado = await servicios.crearEmprendimiento(datosEmprendimiento, idUsuario, buffer, callback)
}

async function editarEmprendimiento(req, res) {
    const datosEmprendimiento = req.body
    const id = req.params.id
    const buffer = req.file ? req.file.buffer : null
    const callback = (error, resultado) => {
        console.log("resultado:", resultado)
        if (resultado) {
            res.status(201).json(resultado)
        } else {
            res.status(400).json({mensaje: "No se pudo editar el presupuesto."})
        }}
        const resultado = await servicios.editarEmprendimiento(datosEmprendimiento, id,buffer, callback)
    }

export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }