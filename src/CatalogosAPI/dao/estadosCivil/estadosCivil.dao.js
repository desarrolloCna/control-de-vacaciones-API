export const getEstadoCivilDao = async () => {
    try {
        const result = await Connection.execute("SELECT idEstadoCivil, estadoCivil, estado FROM estadosCivil;");
        return [result.rows]; // Mantiene formato [estadosCivil]
    } catch (error) {
        console.log("Error en getEstadoCivilDao:", error);
        throw error;
    }
};