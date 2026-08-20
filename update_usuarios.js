import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const run = async () => {
    try {
        console.log("Iniciando actualización de nombres de usuario...");

        // Traemos todos los usuarios junto con su correo institucional si lo tienen
        const query = `
            SELECT u.idUsuario, u.usuario, u.idEmpleado, e.correoInstitucional 
            FROM usuarios u
            LEFT JOIN empleados e ON u.idEmpleado = e.idEmpleado
            WHERE u.idEmpleado IS NOT NULL
        `;
        
        const result = await Connection.execute(query);
        const usuarios = result.rows;

        let actualizados = 0;
        const tx = await Connection.transaction("write");

        for (const user of usuarios) {
            let nuevoUser = user.usuario;
            
            if (user.correoInstitucional && user.correoInstitucional.includes('@')) {
                nuevoUser = user.correoInstitucional.split('@')[0].trim().toLowerCase();
            } else if (user.correoInstitucional && !user.correoInstitucional.includes('@')) {
                // If it doesn't have an @ but is populated, it might just be the username already
                nuevoUser = user.correoInstitucional.trim().toLowerCase();
            } else {
                // Keep existing or logic...
                console.log(`Usuario ${user.usuario} no tiene correo institucional. Se omitirá.`);
                continue;
            }

            if (nuevoUser !== user.usuario) {
                await tx.execute({
                    sql: `UPDATE usuarios SET usuario = ? WHERE idUsuario = ?`,
                    args: [nuevoUser, user.idUsuario]
                });
                actualizados++;
                console.log(`Cambiado: ${user.usuario} -> ${nuevoUser}`);
            }
        }

        await tx.commit();
        console.log(`Proceso finalizado. Se actualizaron ${actualizados} usuarios.`);
    } catch (e) {
        console.error("Error al actualizar usuarios:", e);
    }
};

run();
