import modelos from "../modelos/presupuestos.modelos.js"

async function listarPresupuestos(id_usuario) {
    const resultado = await modelos.listarPresupuestos(id_usuario)
    if (resultado !== null) {
        return resultado
    } else {
        return null
    }
}

async function buscarPresupuesto(req, res) { const resultado = await modelos.listarPresupuesto(req)
    if (resultado !== null) { return resultado } 
    else { return null } };

async function crearPresupuesto(datosPresupuesto, id_usuario) {
    const resultado = await modelos.crearPresupuesto(datosPresupuesto, id_usuario)
    return resultado
}

async function editarEstado(id, estado) {
    const resultado = await modelos.actualizarPresupuesto(id, estado)
    return resultado
}

async function editarVencimiento(id, vencimiento) {
    const resultado = await modelos.editarVencimiento(id, vencimiento)
    return resultado
}
export default { listarPresupuestos, editarEstado, buscarPresupuesto, crearPresupuesto,editarVencimiento }
