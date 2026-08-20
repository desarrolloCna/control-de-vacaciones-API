import { createClient } from "@libsql/client";
import "dotenv/config";

const PROD_URL = "libsql://vacacionesapp-desarrollocna.aws-us-east-1.turso.io";
const PROD_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY2OTgyNTgsImlkIjoiYjk5MDQ3YjctNDcwNy00OWQyLWE3MjgtNmM2N2Q4YWQ3YzVmIiwicmlkIjoiMDBjNTUyNWMtYjM4Yi00NWVjLWFiMDYtMTQzZjYxMDMzNGUyIn0.vRuaC-4K7HUJG37kGgUB-NouZSLSRkiKtrsxQziRW3xS2HstbLeaxKI0-5m5u_BSKQpYJQYUgG0b_VPrvsjwDQ";
const LOCAL_URL = "file:./vacaciones.db";

async function replicateAll() {
    const prod = createClient({ url: PROD_URL, authToken: PROD_TOKEN });
    const local = createClient({ url: LOCAL_URL });

    console.log("🔍 Obteniendo lista completa de objetos desde producción...");
    const prodObjects = await prod.execute("SELECT name, type, sql FROM sqlite_master WHERE name NOT LIKE 'sqlite_%' AND name NOT LIKE 'libsql_%'");
    
    console.log(`Encontrados ${prodObjects.rows.length} objetos (tablas/vistas/índices).\n`);

    for (const obj of prodObjects.rows) {
        const { name, type, sql } = obj;
        console.log(`Replicando ${type}: ${name}...`);

        try {
            // 1. Eliminar si ya existe
            await local.execute(`DROP ${type} IF EXISTS "${name}"`);
            
            // 2. Crear esquema
            if (sql) {
                await local.execute(sql);
            }

            // 3. Si es tabla, copiar datos
            if (type === 'table') {
                const data = await prod.execute(`SELECT * FROM "${name}"`);
                if (data.rows.length > 0) {
                    const columns = data.columns;
                    const placeholders = columns.map(() => "?").join(", ");
                    const insertSql = `INSERT INTO "${name}" (${columns.map(c => `"${c}"`).join(", ")}) VALUES (${placeholders})`;
                    
                    for (const row of data.rows) {
                        const values = Array.isArray(row) ? row : Object.values(row);
                        try {
                            await local.execute({ sql: insertSql, args: values });
                        } catch (e) {
                            // Ignorar fallos de FK durante la carga inicial si es necesario, 
                            // pero intentaremos insertar todo.
                            if (!e.message.includes("FOREIGN KEY")) {
                                console.warn(`   ⚠️ Error en fila de ${name}: ${e.message}`);
                            }
                        }
                    }
                    console.log(`   ✅ Datos copiados: ${data.rows.length} registros.`);
                } else {
                    console.log(`   ℹ️ Tabla vacía.`);
                }
            } else {
                console.log(`   ✅ Esquema de ${type} replicado.`);
            }
        } catch (error) {
            console.error(`   ❌ Error replicando ${name}: ${error.message}`);
        }
    }

    console.log("\n🚀 Replicación completa finalizada.");
    process.exit(0);
}

replicateAll().catch(err => {
    console.error("Fallo general:", err);
    process.exit(1);
});
