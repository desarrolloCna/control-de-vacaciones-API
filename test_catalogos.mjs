import { Connection } from './src/catalogosapi/dao/conexionb/conexioncatsqlite.js';

async function test() {
    // Test the exact queries from the DAOs
    const tests = [
        { name: 'renglones DAO', sql: "SELECT idRenglonPresupuestario, renglon, descripcion, estado FROM renglonesPresupuestarios;" },
        { name: 'comunidades DAO', sql: "SELECT * FROM comunidadesLinguisticas;" },
        { name: 'parentesco DAO', sql: "SELECT * FROM parentescos;" },
        { name: 'estadoCivil DAO', sql: "SELECT * FROM estadosCivil;" },
    ];

    for (const t of tests) {
        try {
            const res = await Connection.execute(t.sql);
            console.log(`✅ ${t.name}: ${res.rows.length} rows`, res.rows.slice(0, 2));
        } catch (error) {
            console.error(`❌ ${t.name}: ${error.message}`);
        }
    }
}
test();
