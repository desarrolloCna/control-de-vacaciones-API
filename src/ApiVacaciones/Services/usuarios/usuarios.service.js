
import { getDatosContactoEmpleadoDao } from "../../Dao/empleados/GetDataEmpleados.dao.js";
import { ObtenerNombresDao } from "../../Dao/informacionPersonal/infoPersonalEmple.dao.js";
import { CrearUsuarioDao } from "../../Dao/usuarios/usuarios.dao.js";
import { EnviarMailServices } from "../email/enviarEmail.service.js";
import { GenerarPassword, GenerarUsuarioService } from "../generalServices/userGenerator.service.js";


export const CrearUsuarioService = async (data) => {
    try{

        const datosContactoEmpleado = await getDatosContactoEmpleadoDao(data.idInfoPersonal);

        const nombres = await ObtenerNombresDao(data.idEmpleado); //se obtiene nombre del empleado para generar usuario.
        const user = await GenerarUsuarioService(nombres);
        const pass = GenerarPassword();
        const idRol = data.isCoordinador == 1 ? 5 : 4;

        const dataUser = {
            idEmpleado: data.idEmpleado,
            idRol,
            user,
            pass,
            correo: data.correoInstitucional || datosContactoEmpleado?.correoPersonal
        }

        const idUsuario = await CrearUsuarioDao(dataUser);
        await EnviarMailServices(dataUser);

        return idUsuario;;
    }catch(error){
        console.error('Error al crear el usuario:', error); // Añadir log de error
        throw error;
 
    }
  }
