import { conexion } from "../data.js"
//verificamos existencia si hay usuario existente con mail
async function verificarexistencia(email) {
    try {
        const consulta = "SELECT usuarios.email FROM usuarios WHERE email = ?"
        const resultado = await conexion.execute(consulta, [email])
        if (resultado) { return false } else { return true }
    }
    catch (error) { throw error }
};

async function a(params) {
    
}
export default verificarexistencia