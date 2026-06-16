import modelos from "../modelos/presupuestos.modelos.js"

async function listarPresupuestos(id_usuario) {
    const resultado = await modelos.listarPresupuestos(id_usuario)

    // if (resultado !== null) {
    //     const token = generarToken({email: email, password: password, id: resultado[0].id})
    //     console.log(token)
    //     return {token, usuario: {id: resultado[0].id, nombre: resultado[0].nombre, email: resultado[0].email}}
    // } else {
    //     return null
    // }
}

async function buscar(req, res) {
    const presupuestoid = parseInt(req.params.id)
    const resultado =await servicios.getid(presupuestoid)
    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se ha encontrado el presupuesto."})
    }
};

async function creacion(id_usuario,id_cliente,fecha_emision,fecha_vencimiento,estado_enum,monto_subtotal,descuento,impuestos,recargo,monto_total){
    const resultado = await modelos.crearpresupuesto(id_usuario,id_cliente,fecha_emision,fecha_vencimiento,estado_enum,monto_subtotal,descuento,impuestos,recargo,monto_total)
    return resultado
}

async function edicionestado(){}

export default { listarPresupuestos, edicionestado, buscar }