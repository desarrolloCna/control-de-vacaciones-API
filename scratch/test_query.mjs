import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function test() {
    const res = await Connection.execute("SELECT idSolicitud, correlativo, estadoSolicitud FROM solicitudes_vacaciones;");
    console.log(res.rows);
}
test();
