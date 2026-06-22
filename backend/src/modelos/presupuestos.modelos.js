import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"

async function crearPresupuesto(datosPresupuesto, id_usuario) {
    // Desestructuración de datos del presupuesto.
    const { cliente_nombre, cliente_email, cliente_telefono, notas, subtotal, descuento_tipo, descuento_valor, descuento_monto, 
        base_imponible, iva_porcentaje, iva_monto, total, estado} = datosPresupuesto
    
    // Generamos los datos faltantes. 
    const id_presupuesto = v4()
    const numero = id_presupuesto.replace(/\D/g, "").slice(0, 5)
    const fecha_creacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fecha_vencimiento = dayjs(fecha_creacion).add(15, "day").format('YYYY-MM-DD')
    const fecha_ultima_modificacion = fechaCreacion
    
    // Guardamos el presupuesto en la base de datos.
    const consultaAgregarNuevoPresupuesto = "INSERT INTO presupuestos (id, id_usuario, fecha_creacion, fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero, cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const resultadoNuevoPresupuesto = await conexion.execute(consultaAgregarNuevoPresupuesto, 
        [id_presupuesto, id_usuario, fecha_creacion, 
        fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero, 
        cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas])
    
    // Guardamos los ítems en la tabla correspondiente.
    for (const item of datosPresupuesto.items) {
        const { descripcion, cantidad, precio_unitario, subtotal } = item
        const id_item = v4()
        const consultaItems = "INSERT INTO items_presupuesto (id_item, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)"
        const resultadoItems = await conexion.execute(consultaItems, [id_item, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal])
    }

    // Generamos la consulta para traer los datos del presupuesto y sus respectivos ítems. 
    const consultaDevolverNuevoPresupuesto = "SELECT * FROM presupuestos JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto WHERE presupuestos.id = ?"
    const resultadoDevolverNuevoPresupuesto = await conexion.execute(consultaDevolverNuevoPresupuesto, [id_presupuesto])

    // Generamos la estructura solicitada para retornar al front.
    const objetoADevolver = resultadoDevolverNuevoPresupuesto[0].reduce((acumulador, fila) => {
        if (!acumulador) {
            return {
                id: fila.id,
                id_usuario: fila.id_usuario,
                fecha_creacion: fila.fecha_creacion,
                fecha_vencimiento: fila.fecha_vencimiento,
                cliente_nombre: fila.cliente_nombre,
                cliente_email: fila.cliente_email,
                estado: fila.estado,
                subtotal: fila.subtotal,
                descuento_valor: fila.descuento_valor,
                descuento_tipo: fila.descuento_tipo,
                descuento_monto: fila.descuento_monto,
                total: fila.total,
                numero: fila.numero,
                cliente_telefono: fila.cliente_telefono,
                base_imponible: fila.base_imponible,
                iva_porcentaje: fila.iva_porcentaje,
                iva_monto: fila.iva_monto,
                notas: fila.notas,
                items: [
                    {
                        id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precio_unitario: fila.precio_unitario,
                        subtotal: fila.subtotal
                    }
                ]
            }
        } else {
            acumulador.items.push({id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precio_unitario: fila.precio_unitario,
                        subtotal: fila.subtotal})
            return acumulador
        }
    }, null)

    return objetoADevolver
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

export default { crearPresupuesto, listarPresupuestos, listaruno }