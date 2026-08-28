import { Connection } from './src/apivacaciones/dao/connection/conexionsqlite.dao.js';

async function deleteTests() {
    try {
        // Delete all employees with idEmpleado > 114
        const emps = await Connection.execute('SELECT idEmpleado, idInfoPersonal FROM empleados WHERE idEmpleado > 114');
        for (const emp of emps.rows) {
            console.log(`Deleting idEmpleado ${emp.idEmpleado} (idInfoPersonal ${emp.idInfoPersonal})`);
            await Connection.execute('DELETE FROM usuarios WHERE idEmpleado = ?', [emp.idEmpleado]);
            await Connection.execute('DELETE FROM coordinadores WHERE idEmpleado = ?', [emp.idEmpleado]);
            await Connection.execute('DELETE FROM empleados WHERE idEmpleado = ?', [emp.idEmpleado]);
            
            if (emp.idInfoPersonal) {
                await Connection.execute('DELETE FROM familiaresEmpleado WHERE idInfoPersonal = ?', [emp.idInfoPersonal]).catch(()=>{});
                await Connection.execute('DELETE FROM nivelEducativoInf WHERE idInfoPersonal = ?', [emp.idInfoPersonal]).catch(()=>{});
                await Connection.execute('DELETE FROM pertenenciaSociolinguistica WHERE idInfoPersonal = ?', [emp.idInfoPersonal]).catch(()=>{});
                await Connection.execute('DELETE FROM datosMedicos WHERE idInfoPersonal = ?', [emp.idInfoPersonal]).catch(()=>{});
                
                const infoRes = await Connection.execute('SELECT idDpi FROM infoPersonalEmpleados WHERE idInfoPersonal = ?', [emp.idInfoPersonal]);
                const idDpi = infoRes.rows.length > 0 ? infoRes.rows[0].idDpi : null;
                
                await Connection.execute('DELETE FROM infoPersonalEmpleados WHERE idInfoPersonal = ?', [emp.idInfoPersonal]).catch(()=>{});
                if (idDpi) {
                    await Connection.execute('DELETE FROM dpiEmpleados WHERE idDpi = ?', [idDpi]).catch(()=>{});
                }
            }
        }
        
        // Also delete any infoPersonalEmpleados > 114 that might be orphaned or incomplete
        const infos = await Connection.execute('SELECT idInfoPersonal, idDpi FROM infoPersonalEmpleados WHERE idInfoPersonal > 114');
        for (const info of infos.rows) {
            console.log(`Deleting orphaned idInfoPersonal ${info.idInfoPersonal}`);
            await Connection.execute('DELETE FROM familiaresEmpleado WHERE idInfoPersonal = ?', [info.idInfoPersonal]).catch(()=>{});
            await Connection.execute('DELETE FROM nivelEducativoInf WHERE idInfoPersonal = ?', [info.idInfoPersonal]).catch(()=>{});
            await Connection.execute('DELETE FROM pertenenciaSociolinguistica WHERE idInfoPersonal = ?', [info.idInfoPersonal]).catch(()=>{});
            await Connection.execute('DELETE FROM datosMedicos WHERE idInfoPersonal = ?', [info.idInfoPersonal]).catch(()=>{});
            await Connection.execute('DELETE FROM infoPersonalEmpleados WHERE idInfoPersonal = ?', [info.idInfoPersonal]).catch(()=>{});
            if (info.idDpi) {
                await Connection.execute('DELETE FROM dpiEmpleados WHERE idDpi = ?', [info.idDpi]).catch(()=>{});
            }
        }
        
        console.log("Cleanup complete!");
    } catch (e) {
        console.error(e);
    }
}

deleteTests();
