import modelos from "../modelos/presupuestos.modelos.js"
import { v2 as cloudinary } from "cloudinary"
import helpers from "../helpers.js"

async function listarPresupuestos(id_usuario) {
    const resultado = await modelos.listarPresupuestos(id_usuario)
    if (resultado !== null) {
        return resultado
    } else {
        return null
    }
}

async function buscarPresupuesto(req, res) { const resultado = await modelos.listarPresupuesto(req)
    if (resultado !== null) { return resultado } 
    else { return null } };

async function crearPresupuesto(datosPresupuesto, id_usuario) {
    const perteneceAlUsuario = await modelos.emprendimientoPerteneceAlUsuario(datosPresupuesto.id_emprendimiento, id_usuario)
    if (!perteneceAlUsuario) {
        return null
    }
    const resultado = await modelos.crearPresupuesto(datosPresupuesto, id_usuario)
    return resultado
}

async function editarEstado(id, estado) {
    const resultado = await modelos.actualizarPresupuesto(id, estado)
    return resultado
}

async function editarVencimiento(id, vencimiento) {
    const resultado = await modelos.editarVencimiento(id, vencimiento)
    return resultado
}

function guardarEnCloudinary(buffer, callback) {
    try {
        const stream = cloudinary.uploader.upload_stream({resource_type: "image"}, callback)
        helpers.bufferAStream(buffer).pipe(stream)
    } catch (error) {
        callback(error, null)
    }
}

async function guardarURL(id_presupuesto, url) {
    try {
        const resultado = await modelos.guardarURL(id_presupuesto, url)
        return resultado
    } catch (error) {
        return error
    }
}

export default { listarPresupuestos, editarEstado, buscarPresupuesto, crearPresupuesto, editarVencimiento, guardarEnCloudinary, guardarURL }
