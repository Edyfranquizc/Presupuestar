import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"

async function crearPresupuesto(datosPresupuesto, idUsuario) {
    // Desestructuración de datos del presupuesto.
    const { clienteNombre, clienteEmail, clienteTelefono, notas, subtotal, descuentoTipo, descuentoValor, descuentoMonto, 
        baseImponible, ivaPorcentaje, ivaMonto, total, estado} = datosPresupuesto
    
    // Generamos los datos faltantes. 
    const idPresupuesto = v4()
    const numero = idPresupuesto.replace(/\D/g, "").slice(0, 5)
    const fechaCreacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fechaVencimiento = dayjs(fechaCreacion).add(15, "day").format('YYYY-MM-DD')
    const fechaUltimaModificacion = fechaCreacion
    
    // Guardamos el presupuesto en la base de datos.
    const consultaAgregarNuevoPresupuesto = "INSERT INTO presupuestos (id, id_usuario, fecha_creacion, fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero, cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const resultadoNuevoPresupuesto = await conexion.execute(consultaAgregarNuevoPresupuesto, 
        [idPresupuesto, idUsuario, fechaCreacion, 
        fechaVencimiento, estado, subtotal, descuentoValor, total, fechaUltimaModificacion, numero, 
        clienteNombre, clienteEmail, clienteTelefono, descuentoTipo, descuentoMonto, baseImponible, ivaPorcentaje, ivaMonto, notas])
    
    // Guardamos los ítems en la tabla correspondiente.
    for (const item of datosPresupuesto.items) {
        const { descripcion, cantidad, precioUnitario, subtotal } = item
        const idItem = v4()
        const consultaItems = "INSERT INTO items_presupuesto (id_item, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)"
        const resultadoItems = await conexion.execute(consultaItems, [idItem, idPresupuesto, descripcion, cantidad, precioUnitario, subtotal])
    }

    // Generamos la consulta para traer los datos del presupuesto y sus respectivos ítems. 
    const consultaDevolverNuevoPresupuesto = "SELECT * FROM presupuestos JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto WHERE presupuestos.id = ?"
    const resultadoDevolverNuevoPresupuesto = await conexion.execute(consultaDevolverNuevoPresupuesto, [idPresupuesto])

    // Generamos la estructura solicitada para retornar al front.
    const objetoADevolver = resultadoDevolverNuevoPresupuesto[0].reduce((acumulador, fila) => {
        if (!acumulador) {
            return {
                id: fila.id,
                id_usuario: fila.id_usuario,
                fechaCreacion: fila.fecha_creacion,
                fechaVencimiento: fila.fecha_vencimiento,
                cliente_nombre: fila.cliente_nombre,
                cliente_email: fila.cliente_email,
                estado: fila.estado,
                subtotal: fila.subtotal,
                descuentoValor: fila.descuento_valor,
                descuentoTipo: fila.descuento_tipo,
                descuentoMonto: fila.descuento_monto,
                total: fila.total,
                numero: fila.numero,
                cliente_telefono: fila.cliente_telefono,
                baseImponible: fila.base_imponible,
                ivaPorcentaje: fila.iva_porcentaje,
                ivaMonto: fila.iva_monto,
                notas: fila.notas,
                items: [
                    {
                        id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precioUnitario: fila.precio_unitario,
                        subtotal: fila.subtotal
                    }
                ]
            }
        } else {
            acumulador.items.push({id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precioUnitario: fila.precio_unitario,
                        subtotal: fila.subtotal})
            return acumulador
        }
    }, null)

    return objetoADevolver
}
async function listarPresupuesto(id) {
    const consulta = "SELECT * FROM presupuestos where `id` = ? LIMIT 1"
    const resultado = await conexion.execute(consulta, [id])
    return resultado[0]
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
async function actualizarPresupuesto(id, estado) {
    const fecha_ultima_modificacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const consulta = "UPDATE `presupuestos` SET `estado` = ?,`fecha_ultima_modificacion`= ? WHERE `id` = ?"
    const estat = ["pendiente", "vencido", "rechazado", "aceptado"]
    for (let check = 0, r = estat.length; check < r; check++) { 
        if (estado.estado == estat[check]) { 
            const resultado = await conexion.execute(consulta, [estado.estado, fecha_ultima_modificacion, id])
        return resultado
        } 
    }
    return null
}
export default { crearPresupuesto, listarPresupuestos, listarPresupuesto, actualizarPresupuesto }
