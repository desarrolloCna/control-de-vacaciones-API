import { createClient } from "@libsql/client";
import "dotenv/config";

const db = createClient({ 
    url: process.env.DB_TURSO_URL, 
    authToken: process.env.DB_TURSO_AUTH_TOKEN 
});

db.execute('SELECT count(*) as total FROM usuarios')
    .then((r) => console.log('✅ Conexion local VACAS EXITOSA. Usuarios:', r.rows[0].total))
    .catch(e => console.error('❌ Fallo local VACAS:', e.message));

const db2 = createClient({ 
    url: process.env.DB_CATALOGOS_URL, 
    authToken: process.env.DB_TURSO_AUTH_TOKEN 
});

db2.execute('SELECT count(*) as total FROM departamentos')
    .then((r) => console.log('✅ Conexion local CATALOGOS EXITOSA. Departamentos:', r.rows[0].total))
    .catch(e => console.error('❌ Fallo local CATALOGOS:', e.message));
