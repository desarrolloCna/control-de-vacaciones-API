export const getReligionesDao = async () => {
    try {
        const result = await Connection.execute("SELECT idReligion, religion, estado FROM religiones;");
        return [result.rows]; // Mantiene formato [religiones]
    } catch (error) {
        console.log("Error en getReligionesDao:", error);
        throw error;
    }
};