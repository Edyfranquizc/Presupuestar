// Faltan los imports de la base de datos (básicamente, el de conexión)

async function verificarUsuario(email, password) {
    // Acá faltaría trabajar con librerías que comparen las contraseñas hasheadas. 
    const consulta = "SELECT * FROM tabla WHERE email = ? AND passoword = ?"
    const resultado = await db.execute(consulta, [email, password])
    if (resultado[0].length > 0) {
        return resultado[0]
    } else {
        return null
    } 
}

export default { verificarUsuario }