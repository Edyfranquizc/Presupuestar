import { conexion } from "../data.js"
import { v4 } from "uuid"
import { v2 as cloudinary } from "cloudinary"

async function listarEmprendimientos(id_usuario) {
    const consulta = "SELECT * FROM emprendimientos WHERE id_usuario = ?"
    const consultaEmprendimientos = await conexion.execute(consulta, [id_usuario])
    const consultaCantidadEmprendimientos = "SELECT COUNT(id) FROM emprendimientos WHERE id_usuario = ?"
    const cantidadEmprendimientos = await conexion.execute(consultaCantidadEmprendimientos, [id_usuario])
    if (consultaEmprendimientos[0]) {
        return consultaEmprendimientos[0]
    } else {
        return null
    }
}

async function crearEmprendimiento(datosEmprendimiento, id_usuario, url) {
    const { nombre, rubro, moneda, cuit } = datosEmprendimiento
    const consultaCantidadEmprendimientos = "SELECT COUNT(id) FROM emprendimientos WHERE id_usuario = ?"
    const cantidadEmprendimientos = await conexion.execute(consultaCantidadEmprendimientos, [id_usuario])
    if (cantidadEmprendimientos[0][0]['COUNT(id)'] < 3) {
        const id = v4()
        const consultaNuevoEmprendimiento = "INSERT INTO emprendimientos (id, nombre, rubro, moneda, cuit, logo_url, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)"
        const nuevoEmprendimiento = await conexion.execute(consultaNuevoEmprendimiento, [id, nombre, rubro, moneda, cuit ?? null, url, id_usuario])
        return { id, nombre, rubro, moneda, cuit, url }
    } else {
        return false
    }
}

async function editarEmprendimiento(datosEmprendimiento, id) {
    for (const dato of Object.entries(datosEmprendimiento)) {
        const columna = dato[0]
        const valor = dato[1]
        const consultaActualizar = `UPDATE emprendimientos SET ${columna} = ? WHERE id = ?`
        const resultadoConsultaActualizar = await conexion.execute(consultaActualizar, [valor, id])
    }
    const editadoEmprendimiento = await conexion.execute("SELECT * FROM emprendimientos WHERE id = ?", [id])
    return editadoEmprendimiento[0]
}

async function traerEmprendimiento(id) {
    const consulta = "SELECT emprendimientos.logo_url FROM emprendimientos WHERE id = ?"
    const consultaEmprendimientos = await conexion.execute(consulta, [id])
    if (consultaEmprendimientos[0]) {
        return consultaEmprendimientos[0]
    } else {
        return null
    }
}
export default { listarEmprendimientos, crearEmprendimiento, editarEmprendimiento, traerEmprendimiento }
