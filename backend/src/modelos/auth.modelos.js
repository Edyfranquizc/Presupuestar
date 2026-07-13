import { conexion } from "../data.js"
import bcrypt from "bcrypt"
import dayjs from "dayjs"
import { v4 } from "uuid"
import modelos from "./usuarios.modelos.js"

async function verificarUsuario(email, password) {
    const consulta = "SELECT usuarios.id, usuarios.nombre, usuarios.email, usuarios.password_hash FROM usuarios WHERE email = ?"
    const resultado = await conexion.execute(consulta, [email])

    if (resultado[0].length > 0) {
        const hash = resultado[0][0].password_hash
        if (bcrypt.compareSync(password, hash)) {
            return resultado[0]
        } else {
            return null
        }
    } else {
        return null
    }
}

async function registrarUsuario(datosUsuario) {
    const { email, nombre, apellido, fecha_nacimiento, ubicacion, password } = datosUsuario
    const verificacion = await modelos.verificarexistencia(email)

    if (!verificacion) {
        const password_hash = await bcrypt.hashSync(password, 10)
        const id = v4()
        const fecha_registro = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const consulta = "INSERT INTO usuarios (id, nombre, apellido, email, password_hash, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)"
        const resultado = await conexion.execute(consulta, [id, nombre, apellido, email, password_hash, fecha_registro])
        return { id, nombre, email }
    } else { 
        return null
    }
}
export default { verificarUsuario, registrarUsuario }
