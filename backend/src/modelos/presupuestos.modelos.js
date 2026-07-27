import { conexion } from "../data.js"
import dayjs from "dayjs"
import { v4 } from "uuid"

async function crearPresupuesto(datosPresupuesto, id_usuario) {
    // Desestructuración de datos del presupuesto.
    const { cliente_nombre, cliente_email, cliente_telefono, notas, subtotal, descuento_tipo, descuento_valor, descuento_monto,
        base_imponible, iva_porcentaje, iva_monto, total, estado, id_emprendimiento } = datosPresupuesto

    // Generamos los datos faltantes. 
    const id_presupuesto = v4()
    const numero = id_presupuesto.replace(/\D/g, "").slice(0, 5)
    const fecha_creacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const fecha_vencimiento = dayjs(fecha_creacion).add(15, "day").format('YYYY-MM-DD')
    const fecha_ultima_modificacion = fecha_creacion

    // Guardamos el presupuesto en la base de datos.
    const consultaAgregarNuevoPresupuesto = "INSERT INTO presupuestos (id, fecha_creacion, fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero, cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas, id_emprendimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    const resultadoNuevoPresupuesto = await conexion.execute(consultaAgregarNuevoPresupuesto,
        [id_presupuesto, fecha_creacion,
            fecha_vencimiento, estado, subtotal, descuento_valor, total, fecha_ultima_modificacion, numero,
            cliente_nombre, cliente_email, cliente_telefono, descuento_tipo, descuento_monto, base_imponible, iva_porcentaje, iva_monto, notas, id_emprendimiento])

    // Guardamos los ítems en la tabla correspondiente.
    for (const item of datosPresupuesto.items) {
        const { descripcion, cantidad, precio_unitario, subtotal } = item
        const id_item = v4()
        const consultaItems = "INSERT INTO items_presupuesto (id_item, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)"
        const resultadoItems = await conexion.execute(consultaItems, [id_item, id_presupuesto, descripcion, cantidad, precio_unitario, subtotal])
    }

    // Generamos la consulta para traer los datos del presupuesto y sus respectivos ítems. 
    const consultaDevolverNuevoPresupuesto = 
    "SELECT presupuestos.*, items_presupuesto.id_item, items_presupuesto.descripcion, items_presupuesto.cantidad, items_presupuesto.precio_unitario, items_presupuesto.subtotal AS item_subtotal " + 
    "FROM presupuestos " + 
    "JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto " + 
    "WHERE presupuestos.id = ?"
    
    const resultadoDevolverNuevoPresupuesto = await conexion.execute(consultaDevolverNuevoPresupuesto, [id_presupuesto])

    // Generamos la estructura solicitada para retornar al front.
    const objetoADevolver = resultadoDevolverNuevoPresupuesto[0].reduce((acumulador, fila) => {
        if (!acumulador) {
            return {
                id: fila.id,
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
                id_emprendimiento: fila.id_emprendimiento,
                items: [
                    {
                        id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precio_unitario: fila.precio_unitario,
                        subtotal: fila.item_subtotal
                    }
                ]
            }
        } else {
            acumulador.items.push({
                id: fila.id_item,
                id_presupuesto: fila.id_presupuesto,
                descripcion: fila.descripcion,
                cantidad: fila.cantidad,
                precio_unitario: fila.precio_unitario,
                subtotal: fila.item_subtotal
            })
            return acumulador
        }
    }, null)

    return objetoADevolver
}

async function listarPresupuesto(id) {
    const consulta = 
    "SELECT presupuestos.*, items_presupuesto.id_item, items_presupuesto.descripcion, items_presupuesto.cantidad, items_presupuesto.precio_unitario, items_presupuesto.subtotal AS item_subtotal " + 
    "FROM presupuestos " + 
    "JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto " + 
    "WHERE presupuestos.id = ?"
    
    const resultado = await conexion.execute(consulta, [id])
    //generamos el presupuesto como se requiere en front.
    const objetoADevolver = resultado[0].reduce((acumulador, fila) => {
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
                url_pdf: fila.url_pdf,
                items: [{
                    id: fila.id_item,
                    id_presupuesto: fila.id_presupuesto,
                    descripcion: fila.descripcion,
                    cantidad: fila.cantidad,
                    precio_unitario: fila.precio_unitario,
                    subtotal: fila.item_subtotal
                }]
            }
        } else {
            acumulador.items.push({
                id: fila.id_item,
                id_presupuesto: fila.id_presupuesto,
                descripcion: fila.descripcion,
                cantidad: fila.cantidad,
                precio_unitario: fila.precio_unitario,
                subtotal: fila.item_subtotal
            })
            return acumulador
        }
    }, null)
    return objetoADevolver
}

async function listarPresupuestos(id_usuario) {
    const consulta = "SELECT presupuestos.*, items_presupuesto.id_item, items_presupuesto.descripcion, items_presupuesto.cantidad, items_presupuesto.precio_unitario, items_presupuesto.subtotal AS item_subtotal " + 
    "FROM presupuestos " + 
    "JOIN emprendimientos ON presupuestos.id_emprendimiento = emprendimientos.id " + 
    "JOIN items_presupuesto ON presupuestos.id = items_presupuesto.id_presupuesto " + 
    "WHERE emprendimientos.id_usuario = ?"
    
    const resultado = await conexion.execute(consulta, [id_usuario])

    // Generamos la estructura para devolver al front.
    const presupuestosFormateados = []
    resultado[0].reduce((acumulador, fila) => {
        const presupuestoEncontrado = acumulador.find((presupuesto) => presupuesto.id === fila.id)
        if (!presupuestoEncontrado) {
            acumulador.push({
                id: fila.id,
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
                id_emprendimiento: fila.id_emprendimiento,
                url_pdf: fila.url_pdf,
                items: [
                    {
                        id: fila.id_item,
                        id_presupuesto: fila.id_presupuesto,
                        descripcion: fila.descripcion,
                        cantidad: fila.cantidad,
                        precio_unitario: fila.precio_unitario,
                        subtotal: fila.item_subtotal
                    }
                ]
            })
            return acumulador
        } else {
            presupuestoEncontrado.items.push({
                id: fila.id_item,
                id_presupuesto: fila.id_presupuesto,
                descripcion: fila.descripcion,
                cantidad: fila.cantidad,
                precio_unitario: fila.precio_unitario,
                subtotal: fila.item_subtotal
            })
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

async function editarVencimiento(id,vencimiento) {
    const fecha_ultima_modificacion = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const consulta2 = "SELECT fecha_vencimiento FROM presupuestos WHERE `id` = ?"
    const presupuestosPendientes = await conexion.execute(consulta2,[id])
    const fechaVencimiento = dayjs(presupuestosPendientes[0].fecha_vencimiento).format('YYYY-MM-DD')
    const nuevo_vencimiento= dayjs(fechaVencimiento).add(parseInt(vencimiento.vencimiento), "day").format('YYYY-MM-DD')
    const consulta = "UPDATE `presupuestos` SET `fecha_vencimiento` = ?,`fecha_ultima_modificacion`= ? WHERE `id` = ?"
    const resultado = await conexion.execute(consulta, [nuevo_vencimiento, fecha_ultima_modificacion, id])
    return resultado
}

async function verificarFechaVencimiento() {
    const consulta = "SELECT id, fecha_vencimiento FROM presupuestos WHERE estado = 'pendiente'"
    const presupuestosPendientes = await conexion.execute(consulta)

    for (const presupuesto of presupuestosPendientes[0]) {
        const fechaVencimiento = dayjs(presupuesto.fecha_vencimiento).format('YYYY-MM-DD')
        const id = presupuesto.id
        const fechaHoy = dayjs().format('YYYY-MM-DD')

        if (fechaVencimiento === fechaHoy) {
            const consultaActualizacion = "UPDATE presupuestos SET estado = 'vencido' WHERE id = ?"
            const presupuestoActualizado = await conexion.execute(consultaActualizacion, [id])
        }
    }
}

async function guardarURL(id_presupuesto, url) {
    const consulta = "UPDATE presupuestos SET url_pdf = ? WHERE id = ?"
    try {
        const resultadoGuardarURL = await conexion.execute(consulta, [url, id_presupuesto])
        return {url}
    } catch (error) {
        return null
    }
}

export default { crearPresupuesto, listarPresupuestos, listarPresupuesto, actualizarPresupuesto, verificarFechaVencimiento, editarVencimiento, guardarURL }
