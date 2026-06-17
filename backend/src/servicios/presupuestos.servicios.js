import modelos from "../modelos/presupuestos.modelos.js"

async function listarPresupuestos(id_usuario) {
    const resultado = await modelos.listarPresupuestos(id_usuario)

    if (resultado !== null) {
        return resultado
    } else {
        return null
    }
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

async function crearPresupuesto(datosPresupuesto, id_usuario){
    const resultado = await modelos.crearPresupuesto(datosPresupuesto, id_usuario)
    return resultado
}

async function edicionestado(){}

export default { listarPresupuestos, edicionestado, buscar, crearPresupuesto }