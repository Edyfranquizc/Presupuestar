import servicios from "../servicios/auth.servicios.js"

async function login(req, res) {
    const { email, password } = req.body
    const resultado = await servicios.login(email, password)
    
    if (resultado !== null) {
        res.status(200).json(resultado)
    } else {
        res.status(400).json({mensaje: "El usuario no existe o las credenciales son incorrectas."})
    }
}

export default { login }