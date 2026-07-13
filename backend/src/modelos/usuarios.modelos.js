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
    for (const dato of Object.entries(datosUsuario)) {
        const columna = dato[0]
        const valor = dato[1]

        const consultaActualizar = `UPDATE usuarios SET ${columna} = ? WHERE id = ?`
        const resultadoConsultaActualizar = await conexion.execute(consultaActualizar, [valor, idUsuario])
    }

    const usuarioActualizado = await traerUsuario(idUsuario)
    return usuarioActualizado
}

async function a(params) {
}

async function cambiarPassword(idUsuario, datosPassword) {
    // Primero comparamos la contraseña que se envía con la contraseña guardada. Si coinciden, se guarda la nueva contraseña. 
    const { passwordActual, passwordNueva } = datosPassword

    
}

export default { verificarexistencia, traerUsuario, actualizarUsuario }