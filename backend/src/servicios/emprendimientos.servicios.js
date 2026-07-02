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

export default { listarEmprendimientos, crearEmprendimiento }