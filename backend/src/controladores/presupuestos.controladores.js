import servicios from "../servicios/presupuestos.servicios.js"

//funcion obterner todos los presupuestos
async function listarPresupuestos(req, res) {
    const id_usuario = req.usuario.id
    const resultado = await servicios.listarPresupuestos(id_usuario)

    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(200).json([])
    }
};
//funcion obterner presupuesto por id
async function buscar(req, res) {
    const presupuestoid = parseInt(req.params.id)
    const resultado =await servicios.getid(presupuestoid)
    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se ha encontrado el presupuesto."})
    }
};
//funcion para añadir presupuesto
async function crearPresupuesto(req, res) {
    const datos = {...req.body}
    const id_usuario = req.usuario.id
    const resultado = await servicios.crearPresupuesto(datos, id_usuario)

    if (resultado !== null) {
        res.status(201).json({mensaje: "Presupuesto creado correctamente."})
    } else {
        res.status(400).json({mensaje: "No se ha podido crear el presupuesto."})
    }
}
//funcion para editar estado de presupuesto
async function edicionestado(req,res){
    const presupuestoid=parseInt(req.params.id)
    const resultado =await servicios.putfunc(presupuestoid)
    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "No se ha podido editar el presupuesto."})
    }
}
export default { listarPresupuestos, edicionestado, crearPresupuesto, buscar }