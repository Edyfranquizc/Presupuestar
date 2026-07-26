import modelos from "../modelos/emprendimientos.modelos.js"
import helpers from "../helpers.js"
import { v2 as cloudinary } from "cloudinary"

async function listarEmprendimientos(id_usuario) {
    const emprendimientos = await modelos.listarEmprendimientos(id_usuario)

    if (emprendimientos != null) {
        return emprendimientos
    } else {
        return false 
    }
}

async function crearEmprendimiento(datosEmprendimiento, idUsuario, buffer) {
    const stream = cloudinary.uploader.upload_stream({resource_type: "image"}, async (error, result) => {
        if (!error) {
            return error
        }
    })

    helpers.bufferAStream(buffer).pipe(stream)
    const url = result.secure_url
    const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, idUsuario, url)

    if (nuevoEmprendimiento != null) {
        return nuevoEmprendimiento
    } else {
        return false 
    }
}
async function editarEmprendimiento(datosEmprendimiento, id) {
    const editEmprendimiento = await modelos.editarEmprendimiento(datosEmprendimiento, id)
    if (editEmprendimiento != null) {
        return editEmprendimiento[0]
    } else {
        return false 
    }
}
export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }
