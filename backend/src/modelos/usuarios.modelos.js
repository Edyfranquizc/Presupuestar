import { conexion } from "../data.js"
import bcrypt from "bcrypt"
import dayjs from "dayjs"

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
        const fechaNacimientoFormateada = dayjs(resultadoUsuario[0][0].fecha_nacimiento).format("YYYY-MM-DD")
        const fechaRegistroFormateada = dayjs(resultadoUsuario[0][0].fecha_registro).format("YYYY-MM-DD")

        const resultadoUsuarioFormateado = {
            id: resultadoUsuario[0][0].id,
            nombre: resultadoUsuario[0][0].nombre,
            apellido: resultadoUsuario[0][0].apellido,
            email: resultadoUsuario[0][0].email,
            password_hash: resultadoUsuario[0][0].password_hash,
            fecha_nacimiento: fechaNacimientoFormateada,
            fecha_registro: fechaRegistroFormateada,
            ubicacion: resultadoUsuario[0][0].ubicacion,
            dni: resultadoUsuario[0][0].dni
        }
        
        return resultadoUsuarioFormateado
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
    const { passwordActual, passwordNueva } = datosPassword
    
    const consulta = "SELECT usuarios.password_hash FROM usuarios WHERE id = ?"
    const resultadoConsulta = await conexion.execute(consulta, [idUsuario])

    if (resultadoConsulta[0].length > 0) {
        const hash = resultadoConsulta[0][0].password_hash
        console.log(hash)
        if (bcrypt.compareSync(passwordActual, hash)) {
            try {
                const passwordNuevaHash = bcrypt.hashSync(passwordNueva, 10)
                const consultaPasswordNueva = "UPDATE usuarios SET password_hash = ? WHERE id = ?"
                const resultadoConsultaPasswordNueva = await conexion.execute(consultaPasswordNueva, [passwordNuevaHash, idUsuario])
            
                return true
            } catch (error) {
                return null
            }
        }
    }
}

export default { verificarexistencia, traerUsuario, actualizarUsuario, cambiarPassword }