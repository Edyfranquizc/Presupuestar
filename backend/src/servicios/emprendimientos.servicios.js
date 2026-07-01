import modelos from "../modelos/emprendimientos.modelos.js"

async function listarEmprendimientos(id_usuario) {
    const emprendimientos = await modelos.listarEmprendimientos(id_usuario)

    if (emprendimientos != null) {
        return emprendimientos
    } else {
        return false 
    }
}