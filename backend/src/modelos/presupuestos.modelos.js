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
    const fecha_ultima_modificacion = fecha_creacion
    
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

async function listarPresupuesto(id) {
    let consulta="SELECT * FROM presupuestos where id = ?"
    const resultado = await conexion.execute(consulta, [id])
    //consulto la tabla de items del presupuesto por separado
    let consultaitems="SELECT items_presupuesto.descripcion,items_presupuesto.cantidad,items_presupuesto.precio_unitario,items_presupuesto.subtotal FROM items_presupuesto left JOIN presupuestos ON id_presupuesto = presupuestos.id where id_presupuesto = ?"
    const resultadoItems=await conexion.execute(consultaitems, [id])
    //paso el diccionario solo
    let saldo =resultado[0]
    //junto el diccionario con la lista de items que obtengo de su consulta
    let suman=[saldo[0],resultadoItems[0]]
    return suman
}

async function listarPresupuestos(id_usuario) {
    const consulta = "SELECT * FROM presupuestos JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto WHERE id_usuario = ?"
    const resultado = await conexion.execute(consulta, [id_usuario])
    
    // Generamos la estructura para devolver al front.
    const presupuestosFormateados = []
    resultado[0].reduce((acumulador, fila) => {
        const presupuestoEncontrado = acumulador.find((presupuesto) => presupuesto.id === fila.id)
        if (!presupuestoEncontrado) {
            acumulador.push({
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
            })
            return acumulador
        } else {
            presupuestoEncontrado.items.push({id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precio_unitario: fila.precio_unitario,
                        subtotal: fila.subtotal})
            return acumulador
        }
    }, presupuestosFormateados)

    if (presupuestosFormateados.length > 0) {
        return presupuestosFormateados
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
