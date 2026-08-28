import {Connection} from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';
async function test() {
    try {
        let r = await Connection.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='historial_vacaciones'");
        console.log("historial_vacaciones:\n", r.rows[0].sql);
        r = await Connection.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='solicitudes_vacaciones'");
        console.log("solicitudes_vacaciones:\n", r.rows[0].sql);
    } catch(e) {
        console.error(e);
    }
}
test();
