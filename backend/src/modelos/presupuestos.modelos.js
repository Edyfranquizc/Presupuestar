import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"

async function crearPresupuesto(datosPresupuesto, idUsuario) {
    const { cliente_nombre, cliente_email, cliente_telefono, notas, subtotal, descuentoTipo, descuentoValor, descuentoMonto, 
        baseImponible, ivaPorcentaje, ivaMonto, total, estado} = datosPresupuesto
    
    const id_presupuesto = v4()
    const numero = id_presupuesto.replace(/\D/g, "").slice(0, 5)
    const fechaCreacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fechaVencimiento = dayjs(fechaCreacion).add(15, "day").format('YYYY-MM-DD')
    const fechaUltimaModificacion = fechaCreacion
    
    const consultaNuevoPresupuesto = "INSERT INTO presupuestos (id, id_usuario, fecha_creacion, fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero, cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const resultadoNuevoPresupuesto = await conexion.execute(consultaNuevoPresupuesto, 
        [id_presupuesto, idUsuario, fechaCreacion, 
        fechaVencimiento, estado, subtotal, descuentoValor, total, fechaUltimaModificacion, numero, 
        cliente_nombre, cliente_email, cliente_telefono, descuentoTipo, descuentoMonto, baseImponible, ivaPorcentaje, ivaMonto, notas])
    
    for (const item of datosPresupuesto.items) {
        const { descripcion, cantidad, precioUnitario, subtotal } = item
        const id_item = v4()
        const consultaItems = "INSERT INTO items_presupuesto (id, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)"
        const resultadoItems = await conexion.execute(consultaItems, [id_item, id_presupuesto, descripcion, cantidad, precioUnitario, subtotal])
    }
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