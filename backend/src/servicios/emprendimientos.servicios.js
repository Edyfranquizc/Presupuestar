import modelos from "../modelos/emprendimientos.modelos.js"
import helpers from "../helpers.js"
import { v2 as cloudinary } from "cloudinary"
import { extractPublicId } from 'cloudinary-build-url'

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
        try {
            const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, id_usuario, null)
            if (nuevoEmprendimiento) {
                callback(null, nuevoEmprendimiento)
            } else {
                callback(new Error("No se pudo crear el emprendimeinto en la base de datos."), null)
            }
        } catch (error) {
            callback(error, null)
        }
    } else {
        try {
            const stream = cloudinary.uploader.upload_stream({ resource_type: "image" }, async (error, result) => {
                if (error) {
                    callback(error, null)
                } else {
                    const url = result.secure_url
                    try {
                        const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, idUsuario, url)
                        if (nuevoEmprendimiento != null) {
                            callback(null, nuevoEmprendimiento)
                        } else {
                            callback(new Error("No se pudo crear el emprendimiento en la base de datos."), null)
                        }
                    } catch (error) {
                        callback(error, null)
                    }
                }
            })
            helpers.bufferAStream(buffer).pipe(stream)
        } catch (error) {
            callback(error, null)
        }
    }
}

async function editarEmprendimiento(datosEmprendimiento, id, buffer, callback) {
    if (buffer != null) {
        try {
            const resurl = await modelos.traerEmprendimiento(id)
            const emprendimiento = resurl[0]
            let publicId = id
            if (emprendimiento.logo_url!= null) { publicId = extractPublicId(emprendimiento.logo_url) }
            const stream = cloudinary.uploader.upload_stream({ resource_type: "image", public_id: publicId, invalidate: true, overwrite: true }, async (error, result) => {
                if (error) {
                    callback(error, null)
                } else {
                    const editaEmprendimiento = await modelos.editarEmprendimiento({ "logo_url": result.secure_url }, id)
                    callback(null, editaEmprendimiento[0])
                }
            })
            helpers.bufferAStream(buffer).pipe(stream)
        } catch (error) {
            callback(error, null)
        }
    } else {
        const editaEmprendimiento = await modelos.editarEmprendimiento(datosEmprendimiento, id)
        if (editaEmprendimiento[0] != null) { callback(null, editaEmprendimiento[0]) }
        else {
            callback(new Error("No se pudo editar el presupuesto en la base de datos."), null)
        }
    }
}

export default { listarEmprendimientos, crearEmprendimiento, editarEmprendimiento }
