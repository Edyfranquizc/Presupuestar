import modelos from "../modelos/emprendimientos.modelos.js"

async function listarEmprendimientos(id_usuario) {
    const emprendimientos = await modelos.listarEmprendimientos(id_usuario)

    if (emprendimientos != null) {
        return emprendimientos
    } else {
        return false 
    }
}

async function crearEmprendimiento(datosEmprendimiento, idUsuario) {
    const nuevoEmprendimiento = await modelos.crearEmprendimiento(datosEmprendimiento, idUsuario)
    if (nuevoEmprendimiento != null) {
        return nuevoEmprendimiento
    } else {
        return false 
    }
}
async function editarEmprendimiento(datosEmprendimiento, id) {
    const editEmprendimiento = await modelos.editarEmprendimiento(datosEmprendimiento, id)
    if (editEmprendimiento != null) {
        return editEmprendimiento[0]
    } else {
        return false 
    }
}
export default { listarEmprendimientos, crearEmprendimiento,editarEmprendimiento }