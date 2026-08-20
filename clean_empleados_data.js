import { createClient } from "@libsql/client";
import "dotenv/config";
import fs from "fs";

const Connection = createClient({
    url: process.env.DB_TURSO_URL,
    authToken: process.env.DB_TURSO_AUTH_TOKEN
});

const catalogos = JSON.parse(fs.readFileSync('C:/Users/jcurruchiche/Desktop/VACAS/Copia_Datos_Catalogos.json', 'utf8'));

// Utilidad para limpiar textos (quitar acentos, trim, lowercase)
const normalize = (str) => {
    if (!str) return '';
    return str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Función para encontrar el string exacto del catálogo
const findExactString = (catArray, fieldName, value) => {
    if (!value) return '';
    const search = normalize(value);
    
    // Primero buscar match exacto normalizado
    for (const item of catArray) {
        if (normalize(item[fieldName]) === search) {
            return item[fieldName]; // retornar el string exacto original
        }
    }
    
    // Si no, buscar "includes"
    for (const item of catArray) {
        if (normalize(item[fieldName]).includes(search) || search.includes(normalize(item[fieldName]))) {
            return item[fieldName];
        }
    }
    
    // Si no encuentra nada, retornar el original trimeado
    return value.trim();
};

const runCleaning = async () => {
    try {
        const empRes = await Connection.execute("SELECT idEmpleado, puesto, unidad, renglon FROM empleados");
        console.log(`Verificando ${empRes.rows.length} empleados...`);

        const tx = await Connection.transaction("write");

        let updates = 0;
        for (const emp of empRes.rows) {
            const originalUnidad = emp.unidad || '';
            const originalPuesto = emp.puesto || '';
            const originalRenglon = emp.renglon || '';

            // Mapeo especial manual si es necesario
            let searchUnidad = originalUnidad.trim();
            if (searchUnidad.includes("Registo")) searchUnidad = "Registro";
            if (searchUnidad.includes("Tecnologias de la Infor") || searchUnidad.includes("Informática")) searchUnidad = "Unidad de Tecnologías de la Información y Comunicación";
            if (searchUnidad.includes("Recursos Humanos")) searchUnidad = "Unidad de Recursos Humanos";
            if (searchUnidad.includes("Planificación")) searchUnidad = "Coordinación de Planificación";
            if (searchUnidad === "Dirección General") searchUnidad = "Dirección General"; // Match
            if (searchUnidad === "Subdirección General") searchUnidad = "Subdirección General"; // Match
            if (searchUnidad.includes("Biologica")) searchUnidad = "Subcoordinación de Atención y Apoyo a la Familia Biológica";
            
            // Eliminar Oficinas Departamentales del prefijo para que coincida con la unidad matriz
            if (searchUnidad.includes("Oficina Departamental")) {
                if (searchUnidad.includes("Biológica")) searchUnidad = "Subcoordinación de Atención y Apoyo a la Familia Biológica";
                if (searchUnidad.includes("Protección y Organismos Internacionales")) searchUnidad = "Subcoordinación de Autorización y Control de Hogares de Protección y Organismos Internacionales";
            }

            const cleanUnidad = findExactString(catalogos.unidades, 'nombreUnidad', searchUnidad);
            const cleanPuesto = findExactString(catalogos.puestos, 'puesto', originalPuesto);
            
            let cleanRenglon = originalRenglon.trim();
            
            await tx.execute({
                sql: "UPDATE empleados SET unidad = ?, puesto = ?, renglon = ? WHERE idEmpleado = ?",
                args: [cleanUnidad, cleanPuesto, cleanRenglon, emp.idEmpleado]
            });
            updates++;
        }
        
        await tx.commit();
        console.log(`Se actualizaron ${updates} registros exitosamente.`);
    } catch (e) {
        console.error("Error limpiando:", e);
    }
};

runCleaning();
