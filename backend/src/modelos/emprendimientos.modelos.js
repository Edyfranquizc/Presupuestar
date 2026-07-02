import { conexion } from "../data.js"
import { v4 } from "uuid"

async function listarEmprendimientos(id_usuario) {
    const consulta = "SELECT * FROM emprendimientos WHERE id_usuario = ?"
    const consultaEmprendimientos = await conexion.execute(consulta, [id_usuario])

    if (consultaEmprendimientos[0]) {
        return consultaEmprendimientos[0]
    } else {
        return null
    }
}

export default { listarEmprendimientos }