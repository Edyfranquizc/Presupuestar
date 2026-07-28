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

async function crearEmprendimiento(datosEmprendimiento, idUsuario, buffer, callback) {
    if (!buffer) {
        const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, id_usuario, null)

        if (nuevoEmprendimiento) {
            callback(null, nuevoEmprendimiento)
        } else {
            callback(new Error("No se pudo crear el emprendimeinto en la base de datos."), null)
        }
    } else {
        const stream = cloudinary.uploader.upload_stream({resource_type: "image"}, async (error, result) => {
            if (error) {
                callback(error, null)
            } else {
                const url = result.secure_url
                const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, idUsuario, url)

                if (nuevoEmprendimiento != null) {
                    callback(null, nuevoEmprendimiento)
                } else {
                    callback(new Error("No se pudo crear el emprendimiento en la base de datos."), null)
                }
            }
        })

        helpers.bufferAStream(buffer).pipe(stream)
    }
}

async function editarEmprendimiento(datosEmprendimiento, id, buffer, callback) {
    if (buffer != undefined) {
        const resurl = await modelos.traerEmprendimiento(id)
        const publicId = extractPublicId(`${Object.values(resurl[0][0])[0]}`)
        const stream = cloudinary.uploader.upload_stream({ resource_type: "image", public_id: publicId, invalidate: true }, async (error, result) => {
            if (error) { callback(error, null) }
        })
    }
    const editaEmprendimiento = await modelos.editarEmprendimiento(datosEmprendimiento, id)
    if (editaEmprendimiento[0] != null) { callback(null, editaEmprendimiento[0]) }
    else { callback(new Error("No se pudo editar el presupuesto en la base de datos."), null) }
    helpers.bufferAStream(buffer).pipe(stream)
}
/*async function editarEmprendimiento(datosEmprendimiento, id) {
    const editEmprendimiento = await modelos.editarEmprendimiento(datosEmprendimiento, id)
    if (editEmprendimiento != null) {
        return editEmprendimiento[0]
    } else {
        return false 
    }
}
export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }*/

export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }
