import servicios from "../servicios/presupuestos.servicios.js"

//funcion obterner todos los presupuestos
async function listarPresupuestos(req, res) {
    const id_usuario = req.usuario.id
    const resultado = await servicios.listarPresupuestos(id_usuario)

    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(200).json({mensaje: "No se guardaron presupuestos para este usuario."})
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
async function crear(req,res){
    const nuevopresupuesto={...req.body}
    const resultado =await servicios.postfunc(nuevopresupuesto)
    if (resultado !== null) {
        res.status(200).json(resultado)
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
export default { listarPresupuestos, edicionestado, crear, buscar }