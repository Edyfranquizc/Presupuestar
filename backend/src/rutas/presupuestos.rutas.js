//importo express
import express from "express";
//importo los controladores de presupuesto
import controladores from "../controladores/presupuestos.controladores.js";
//defino ruta
const rutasPres = express.Router();
//funcion get
rutasPres.get("/", controladores.listarPresupuestos)
//funcion get por id
rutasPres.get("/:id", controladores.buscarPresupuesto);
//funcion post
rutasPres.post("/", controladores.crearPresupuesto);
//funcion para cambiar estado
rutasPres.put("/:id/estado",controladores.editarEstado);
//funcion para cambiar estado
rutasPres.put("/:id/vencimiento",controladores.editarVencimiento);
//exporto la ruta
export default rutasPres
