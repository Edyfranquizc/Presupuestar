import express from "express"

function manejar404(req, res) {
    res.status(404).json({mensaje: "Verificá la URL y/o el método HTTP."})
}

export default { manejar404 }