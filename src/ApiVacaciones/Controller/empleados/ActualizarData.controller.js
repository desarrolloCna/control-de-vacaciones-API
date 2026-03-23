import { actualizarDatosLaboralesDao, actualizarInfoPersonalDao, actualizarNivelEducativoDao, actualizarPertenenciaSoLiDao, actualizarDatosMedicosDao, actualizarInfoDpiDao, obtenerEmpleadoPorInfoPersonalDao } from "../../Dao/empleados/ActualizarData.dao.js";
import { ActualizarRolUsuarioDao } from "../../Dao/usuarios/usuarios.dao.js";
import { UpsertCoordinadorDao, DesactivarCoordinadorDao } from "../../Dao/Coordinadores/Coordinadores.Dao.js";

export const actualizarDatosLaboralesController = async (req, res) => {
    try {
        const { idEmpleado } = req.params; // Este idEmpleado es idInfoPersonal en la BD
        const data = req.body;
        const result = await actualizarDatosLaboralesDao(idEmpleado, data);

        // Si se proporciona isCoordinador, actualizar el rol del usuario y el registro en coordinadores
        if (data.isCoordinador !== undefined) {
            const nuevoRol = data.isCoordinador == 1 ? 5 : 4;
            await ActualizarRolUsuarioDao(idEmpleado, nuevoRol);

            // Gestionar tabla coordinadores
            const empleadoInfo = await obtenerEmpleadoPorInfoPersonalDao(idEmpleado);
            if (empleadoInfo) {
                if (data.isCoordinador == 1) {
                    await UpsertCoordinadorDao({
                        idEmpleado: empleadoInfo.idEmpleado,
                        nombreCoordinador: empleadoInfo.nombreCompleto,
                        coordinadorUnidad: empleadoInfo.unidad,
                        correoCoordinador: empleadoInfo.correoInstitucional
                    });
                } else {
                    await DesactivarCoordinadorDao(empleadoInfo.idEmpleado);
                }
            }
        }

        res.status(200).json({ codRes: 200, message: result.message });
    } catch (error) {
        console.log("Error en actualizarDatosLaboralesController:", error);
        res.status(500).json({ codRes: 500, message: "Error al actualizar los datos laborales" });
    }
};

export const actualizarInfoPersonalController = async (req, res) => {
    try {
        const { idInfoPersonal } = req.params;
        const data = req.body;
        const result = await actualizarInfoPersonalDao(idInfoPersonal, data);
        res.status(200).json({ codRes: 200, message: result.message });
    } catch (error) {
        console.log("Error en actualizarInfoPersonalController:", error);
        res.status(500).json({ codRes: 500, message: "Error al actualizar la información personal" });
    }
};

export const actualizarOtrosDatosController = async (req, res) => {
    try {
        const { idInfoPersonal } = req.params;
        const { nivelEducativo, pertenenciaSociolinguistica, datosMedicos } = req.body;
        
        if (nivelEducativo) {
            await actualizarNivelEducativoDao(idInfoPersonal, nivelEducativo);
        }
        if (pertenenciaSociolinguistica) {
            await actualizarPertenenciaSoLiDao(idInfoPersonal, pertenenciaSociolinguistica);
        }
        if (datosMedicos) {
            await actualizarDatosMedicosDao(idInfoPersonal, datosMedicos);
        }
        
        res.status(200).json({ codRes: 200, message: "Datos adicionales actualizados correctamente" });
    } catch (error) {
        console.log("Error en actualizarOtrosDatosController:", error);
        res.status(500).json({ codRes: 500, message: "Error al actualizar los datos adicionales" });
    }
};

export const actualizarInfoDpiController = async (req, res) => {
    try {
        const { idInfoPersonal } = req.params;
        const data = req.body;
        const result = await actualizarInfoDpiDao(idInfoPersonal, data);
        res.status(200).json({ codRes: 200, message: result.message });
    } catch (error) {
        console.log("Error en actualizarInfoDpiController:", error);
        res.status(500).json({ codRes: 500, message: "Error al actualizar la información del DPI" });
    }
};
