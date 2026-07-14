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

async function registro(req, res) {
    const { nombre, apellido, email, password,experiencia_rubro_credito,fecha_nacimiento,ubicacion,dni} = req.body 
    //console.log(nombre, apellido, email,fecha_nacimiento,ubicacion)
    const resultado = await servicios.registro(nombre, apellido, email, password,experiencia_rubro_credito,fecha_nacimiento,ubicacion,dni)
    
    if (resultado !== null) {
        res.status(201).json(resultado)
    } else {
        res.status(400).json({mensaje: "Se produjo un error al registrar al usuario."})
    }
}

export default { login, registro }
