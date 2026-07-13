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
            const fecha_login = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const act=`UPDATE usuarios SET ultimo_login_fecha= ? WHERE usuarios.email = ?`
            const fas = await conexion.execute(act, [fecha_login,email])
            return resultado[0]
        } else {
            return null
        }
    } else {
        return null
    }
}

async function registrarUsuario(nombre, apellido, email, password,experiencia_rubro_credito,fecha_nacimiento,ubicacion) {
    const verificacion = await modelos.verificarexistencia(email)
    /*let co = [nombre, apellido, email, password,fecha_nacimiento,ubicacion,experiencia_rubro_credito]
    for (let i in co){
        console.log(co.at(i))
        if (co[i]==undefined){
            co[i]=null
            console.log(co)
        }
    }
    console.log(nombre, apellido, email,fecha_nacimiento,ubicacion,experiencia_rubro_credito)
    */if (!verificacion) {
        const password_hash = await bcrypt.hashSync(password, 10)
        const id = v4()
        const fecha_registro = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const consulta = "INSERT INTO usuarios (id, nombre, apellido, email, password_hash, fecha_registro,fecha_nacimiento,ubicacion,experiencia_rubro_credito) VALUES (?, ?, ?, ?, ?, ?,?,?,?)"
        const resultado = await conexion.execute(consulta, [id, nombre, apellido, email, password_hash, fecha_registro,fecha_nacimiento,ubicacion,experiencia_rubro_credito])
        return { id, nombre, email }
    } else { 
        return null
    }
}
export default { verificarUsuario, registrarUsuario }
