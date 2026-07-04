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
    const resultadoUsuario = conexion.execute(consulta, [idUsuario])

    if (resultadoUsuario[0]) {
        return resultadoUsuario[0]
    } else {
        return null
    }
    
}

async function a(params) {
}
export default { verificarexistencia, traerUsuario }