import { IngresarEmpleadosService } from "../../services/empleados/empleados.service.js";


export const IngresarEmpleadoController = async (req, res) => {
    try{
        const idEmpleado = await IngresarEmpleadosService(req.body);
        const responseData = {
            status: 200,
            message: "Empleado ingresado correctamente",
            idEmpleado
        }
        res
        .status(200)
        .json({responseData});

    }catch(error){
        console.error("ERROR IN CONTROLLER:", error);
        let status = error?.codRes || 500;
        let responseData = error?.message || "Ocurrió un error inesperado";
        
        if (typeof responseData === "string" && responseData.includes("UNIQUE constraint failed")) {
            status = 409;
            if (responseData.includes("empleado")) {
                responseData = "El empleado ya existe (Correo Institucional duplicado u otro campo único).";
            } else {
                responseData = "El registro ya existe en la base de datos.";
            }
        }
        
        res.status(status).json({ responseData });
    }

}
