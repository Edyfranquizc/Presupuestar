import { conexion } from "../data.js"
import { v4 } from "uuid"

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

async function crearEmprendimiento(datosEmprendimiento, id_usuario) {
    const { nombre, rubro, moneda, cuit, logo_url } = datosEmprendimiento

    const consultaCantidadEmprendimientos = "SELECT COUNT(id) FROM emprendimientos WHERE id_usuario = ?"
    const cantidadEmprendimientos = await conexion.execute(consultaCantidadEmprendimientos, [id_usuario])
    console.log(cantidadEmprendimientos[0])

    if (cantidadEmprendimientos[0][0]['COUNT(id)'] < 3) {
        const id = v4()
        const consultaNuevoEmprendimiento = "INSERT INTO emprendimientos (id, nombre, rubro, moneda, cuit, logo_url, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)"
const nuevoEmprendimiento = await conexion.execute(consultaNuevoEmprendimiento, [id, nombre, rubro, moneda, cuit ?? null, logo_url ?? null, id_usuario])
        return { id, nombre, rubro, moneda, cuit, logo_url }
    } else {
        return false
    }

    
}

export default { listarEmprendimientos, crearEmprendimiento }