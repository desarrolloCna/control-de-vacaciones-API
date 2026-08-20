import { createClient } from "@libsql/client";
import "dotenv/config";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

async function run() {
    try {
        const queryEmp = "SELECT * FROM empleados WHERE idInfoPersonal = (SELECT idInfoPersonal FROM infoPersonalEmpleados WHERE primerNombre = 'Julio' AND primerApellido = 'Curruchiche');";
        const resEmp = await Connection.execute(queryEmp);
        console.log("Empleados:", resEmp.rows);

        const queryPertenencia = "SELECT * FROM pertenenciaSociolinguistica WHERE idInfoPersonal = (SELECT idInfoPersonal FROM infoPersonalEmpleados WHERE primerNombre = 'Julio' AND primerApellido = 'Curruchiche');";
        const resPert = await Connection.execute(queryPertenencia);
        console.log("Pertenencia:", resPert.rows);
        
        const queryFamiliar = "SELECT * FROM familiaresDeEmpleados WHERE idInfoPersonal = (SELECT idInfoPersonal FROM infoPersonalEmpleados WHERE primerNombre = 'Julio' AND primerApellido = 'Curruchiche');";
        const resFam = await Connection.execute(queryFamiliar);
        console.log("Familiares:", resFam.rows);
    } catch (e) {
        console.error(e);
    }
}
run();
