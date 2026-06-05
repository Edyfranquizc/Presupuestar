//importo express
import express from "express";
//importo los controladores de presupuesto
import * as controlador from "/modelos/presupuestos.controladores.js";
//defino ruta
const rutasPres = express.Router();
//funcion get
rutasPres.get("/presupuestos",(req,res)=>{
    const presupuestos=controlador.get()
    res.json(presupuestos)});
//funcion get por id
rutasPres.get("/presupuestos/:id",(req,res)=>{
    const presupuestoid=parseInt(req.params.id)
    const presupuesto=controlador.getid(presupuestoid)
    res.json(presupuesto)
});
//funcion post
rutasPres.post("/presupuestos", (req,res)=>{
    const nuevopresupuesto={...req.body,id:presupuestos.length+1}
    controlador.postfunc(nuevopresupuesto)
    res.send()
});
//funcion put
rutasPres.put("/presupuestos/:id",(req,res)=>{
    const presupuestoid=parseInt(req.params.id)
    const presupuesto=controlador.putfunc(presupuestoid)
    res.send()
});
//funcion delete
rutasPres.delete("/presupuestos/:id",(req,res)=>{
    const presupuestoid=parseInt(req.params.id)
    const presupuesto=controlador.deletefunc(presupuestoid)
    res.send()
});
//exporto la ruta
export default rutasPres
