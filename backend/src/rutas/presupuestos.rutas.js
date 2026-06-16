//importo express
import express from "express";
//importo los controladores de presupuesto
import controladores from "../controladores/presupuestos.controladores.js";
//defino ruta
const rutasPres = express.Router();
//funcion get
rutasPres.get("/", controladores.listarPresupuestos)
//funcion get por id
rutasPres.get("/presupuestos/:id", controladores.buscar);
//funcion post
rutasPres.post("/presupuestos", controladores.crear);
//funcion put
rutasPres.put("/presupuestos/:id",(req,res)=>{
    const presupuestoid=parseInt(req.params.id)
    const presupuesto=controladores.putfunc(presupuestoid)
    res.send()
});
//funcion para cambiar estado
rutasPres.put("/presupuestos/:id/estado",controladores.edicionestado);
//exporto la ruta
export default rutasPres
