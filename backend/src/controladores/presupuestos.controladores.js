import servicios from "../servicios/presupuestos.servicios.js"
import { v2 as cloudinary } from "cloudinary"
import Readable from "stream"

//funcion obterner todos los presupuestos
async function listarPresupuestos(req, res) {
    const id_usuario = req.usuario.id
    const resultado = await servicios.listarPresupuestos(id_usuario)

    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(200).json([])
    }
};
//funcion obterner presupuesto por id
async function buscarPresupuesto(req, res) {
    const presupuestoid = req.params.id
    const resultado =await servicios.buscarPresupuesto(presupuestoid)
    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se ha encontrado el presupuesto."})
    }
};
//funcion para añadir presupuesto
async function crearPresupuesto(req, res) {
    const datos = {...req.body}
    const id_usuario = req.usuario.id
    const resultado = await servicios.crearPresupuesto(datos, id_usuario)

    if (resultado !== null) {
        res.status(201).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se ha podido crear el presupuesto."})
    }
}
//funcion para editar estado de presupuesto
async function editarEstado(req,res){
    const presupuesto=req.body
    const presupuestoid=req.params.id

    const resultado =await servicios.editarEstado(presupuestoid,presupuesto)
    if (resultado !== null) {
        res.status(200).json({mensaje: "Presupuesto editado."})
    } else {
        res.status(400).json({mensaje: "No se ha podido editar el presupuesto."})
    }
}
//funcion para editar estado de presupuesto
async function editarVencimiento(req,res){
    const presupuesto=req.body
    const presupuestoid=req.params.id

    const resultado =await servicios.editarVencimiento(presupuestoid,presupuesto)
    if (resultado !== null) {
        res.status(200).json({mensaje: "Presupuesto editado."})
    } else {
        res.status(400).json({mensaje: "No se ha podido editar el presupuesto."})
    }
}

function bufferAStream(buffer) {
    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)
    return stream
}

async function guardarEnCloudinary(req, res) {
    const stream = await cloudinary.uploader.upload_stream({resource_type: "image"}, (error, result) => {
        if (error) {
            console.log(error)
            res.status(400).json({mensaje: "No se pudo guardar el presupuesto en Cloudinary."})
        }
        res.status(200).json({url_presupuesto: result.secure_url})
    })

    const buffer = req.file.buffer
    await bufferAStream(buffer).pipe(stream)
}
export default { listarPresupuestos, editarEstado, crearPresupuesto, buscarPresupuesto, editarVencimiento, guardarEnCloudinary } 
