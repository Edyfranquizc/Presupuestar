import { conexion } from "../data.js"
import { v4 } from "uuid"

async function listarEmprendimientos(idUsuario) {
    const consulta = "SELECT * FROM emprendimientos WHERE id_usuario = ?"
    const consultaEmprendimientos = await conexion.execute(consulta, [idUsuario])

    if (consultaEmprendimientos[0]) {
        return consultaEmprendimientos[0]
    } else {
        return null
    }
}

async function crearEmprendimiento(datosEmprendimiento, id_usuario) {
    const { nombre, rubro, moneda, cuit, logo_url } = datosEmprendimiento

    const id = v4()
    const consulta = "INSER INTO emprendimientos (id, nombre, rubro, moneda, cuit, logo_url, id_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)"
    const nuevoEmprendimiento = conexion.execute(consulta, [id, nombre, rubro, moneda, cuit, logo_url, id_usuario])

    return { id, nombre, rubro, moneda, cuit, logo_url }
}

export default { listarEmprendimientos }