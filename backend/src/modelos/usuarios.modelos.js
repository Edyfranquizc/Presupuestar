import { conexion } from "../data.js"
//verificamos existencia si hay usuario existente con mail
async function verificarexistencia(email) {
    try {
        const consulta = "SELECT usuarios.email FROM `usuarios` WHERE `email` = ?"
        const resultado = await conexion.execute(consulta, [email])

        if (resultado[0].length > 0) { 
            console.log("ya existe ese email en la db.")
            return true 
        } else { 
            console.log("no existe ese email en la db.")
            return false }
    }
    catch (error) { console.log(error); throw error }
};

async function traerUsuario(idUsuario) {
    const consulta = "SELECT * FROM usuarios WHERE id = ?"
    const resultadoUsuario = await conexion.execute(consulta, [idUsuario])

    if (resultadoUsuario[0]) {
        return resultadoUsuario[0]
    } else {
        return null
    }
}

async function actualizarUsuario(idUsuario, datosUsuario) {
    for (const dato of datosUsuario) {
        const consultaActualizar = `UPDATE ${dato} FROM usuarios WHERE id = ?`
        const resultadoConsultaActualizar = conexion.execute(consulta, [idUsuario])
    }

    const usuarioActualizado = await traerUsuario(idUsuario)
    return usuarioActualizado
}

async function a(params) {
}
export default { verificarexistencia, traerUsuario }