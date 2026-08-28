import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function deleteTestData() {
    const ids = [116, 117, 118];
    try {
        for (const id of ids) {
            // Find idEmpleado first
            const empRes = await Connection.execute('SELECT idEmpleado FROM empleados WHERE idInfoPersonal = ?', [id]);
            const idEmpleado = empRes.rows.length > 0 ? empRes.rows[0].idEmpleado : null;
            
            // Find idDpi
            const infoRes = await Connection.execute('SELECT idDpi FROM infoPersonalEmpleados WHERE idInfoPersonal = ?', [id]);
            const idDpi = infoRes.rows.length > 0 ? infoRes.rows[0].idDpi : null;

            if (idEmpleado) {
                await Connection.execute('DELETE FROM usuarios WHERE idEmpleado = ?', [idEmpleado]);
                await Connection.execute('DELETE FROM coordinadores WHERE idEmpleado = ?', [idEmpleado]);
                await Connection.execute('DELETE FROM empleados WHERE idEmpleado = ?', [idEmpleado]);
            }

            await Connection.execute('DELETE FROM familiaresEmpleado WHERE idInfoPersonal = ?', [id]).catch(e=>console.log(e.message));
            await Connection.execute('DELETE FROM nivelEducativoInf WHERE idInfoPersonal = ?', [id]).catch(e=>console.log(e.message));
            await Connection.execute('DELETE FROM pertenenciaSociolinguistica WHERE idInfoPersonal = ?', [id]).catch(e=>console.log(e.message));
            await Connection.execute('DELETE FROM datosMedicos WHERE idInfoPersonal = ?', [id]).catch(e=>console.log(e.message));
            await Connection.execute('DELETE FROM infoPersonalEmpleados WHERE idInfoPersonal = ?', [id]).catch(e=>console.log(e.message));

            if (idDpi) {
                await Connection.execute('DELETE FROM dpiEmpleados WHERE idDpi = ?', [idDpi]);
            }
            console.log(`Deleted test data for idInfoPersonal ${id}`);
        }
    } catch (e) {
        console.error(e);
    }
}

deleteTestData();
