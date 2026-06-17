import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"

async function crearPresupuesto(datosPresupuesto, idUsuario) {
    if (!datosPresupuesto.idCliente) {
        const { total, subtotal, descuentoMonto, ivaMonto, nombre, email } = datosPresupuesto
        const idCliente = v4()
        const consultaNuevoCliente = "INSERT INTO clientes (id, nombre, email) VALUES (?, ?, ?)"
        const resultadoNuevoCliente = await conexion.execute(consulta, [id_cliente, nombre, email])
    } else {
        const { total, subtotal, descuentoMonto, ivaMonto, idCliente } = datosPresupuesto
    }

    const id = v4()
    const fechaEmision = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fechaVencimiento = dayjs(fecha_emision).add(15, "day").format('YYYY-MM-DD')
    const estado = "pendiente"
    const fechaUltimaModificacion = fecha_emision
    
    const consultaNuevoPresupuesto = "INSERT INTO presupuestos (id, id_usuario, id_cliente, fecha_emision, fecha_vencimiento, estado, monto_subtotal, descuento, impuestos, monto_total, fecha_ultima_modificacion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    
    const resultadoNuevoPresupuesto = await conexion.execute(consulta, 
        [id, idUsuario, idCliente, fechaEmision, 
        fechaVencimiento, estado, subtotal, 
        descuentoMonto, ivaMonto, total, fechaUltimaModificacion])

    return resultado
}

async function listaruno(id) {
    
}
async function listarPresupuestos(id_usuario) {
    const consulta = "SELECT * FROM presupuestos WHERE id_usuario = ?"
    const resultado = await conexion.execute(consulta, [id_usuario])

    if (resultado[0].length > 0) {
        return resultado[0]
    } else {
        return null
    }
}
async function actualizar(id,estado_enum ) {
    const fecha_ultima_modificacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const consulta = ""
}

export default { crearpresupuesto, listarPresupuestos, listaruno }