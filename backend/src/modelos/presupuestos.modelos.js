import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"
async function crearpresupuesto(id_usuario,id_cliente,fecha_vencimiento,estado_enum,monto_subtotal,descuento,impuestos,recargo,monto_total) {
    //let verificacion= verificarexistencia(nombre, apellido, email,)
   // if (verificacion==false){
    const id = v4()
    const fecha_emision = dayjs().format('YYYY-MM-DD')
    const fecha_ultima_modificacion=fecha_emision
    const consulta = "INSERT INTO usuarios (id,id_usuario,id_cliente,fecha_emision,fecha_vencimiento,estado enum,monto_subtotal,descuento,impuestos,recargo,monto_total,fecha_ultima_modificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const resultado = await conexion.execute(consulta, [id,id_usuario,id_cliente,fecha_emision,fecha_vencimiento,estado_enum,monto_subtotal,descuento,impuestos,recargo,monto_total,fecha_ultima_modificacion])

    return resultado
    ///}else{ return "El usuario ya esta registrado" }
    
}
async function listaruno(id) {
    
}
async function listartodo() {
    
}
async function actualizar(id,estado_enum ) {
    const fecha_ultima_modificacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const consulta = ""
}
export default { crearpresupuesto, listartodo,listaruno, }