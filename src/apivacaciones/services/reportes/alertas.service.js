import { obtenerEmpleadosSinVacacionesRecientes, obtenerEmpleadosConExcesoDias } from "../../dao/reports/alertas.dao.js";

export const getAlertasAcumulacionService = async () => {
    // Ejecutar cada consulta de forma independiente para evitar que un fallo bloquee todo
    let sinVacaciones = [];
    let excesoDias = [];

    try {
        sinVacaciones = await obtenerEmpleadosSinVacacionesRecientes();
    } catch (error) {
        console.error("Error en consulta sinVacaciones:", error.message);
    }

    try {
        excesoDias = await obtenerEmpleadosConExcesoDias();
    } catch (error) {
        console.error("Error en consulta excesoDias:", error.message);
    }

    return {
        sinVacaciones,
        excesoDias,
        resumen: {
            totalSinVacaciones: sinVacaciones.length,
            totalExcesoDias: excesoDias.length
        }
    };
};

