import { obtenerEmpleadosSinVacacionesRecientes, obtenerEmpleadosConExcesoDias } from "../../dao/reports/alertas.dao.js";

export const getAlertasAcumulacionService = async () => {
    try {
        const sinVacaciones = await obtenerEmpleadosSinVacacionesRecientes();
        const excesoDias = await obtenerEmpleadosConExcesoDias();

        return {
            sinVacaciones: sinVacaciones,
            excesoDias: excesoDias,
            resumen: {
                totalSinVacaciones: sinVacaciones.length,
                totalExcesoDias: excesoDias.length
            }
        };
    } catch (error) {
        throw error;
    }
};
