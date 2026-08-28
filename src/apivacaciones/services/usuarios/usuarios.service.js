
import { getDatosContactoEmpleadoDao } from "../../dao/empleados/getdataempleados.dao.js";
import { ObtenerNombresDao } from "../../dao/informacionpersonal/infopersonalemple.dao.js";
import { CrearUsuarioDao } from "../../dao/usuarios/usuarios.dao.js";
import { EnviarMailServices } from "../email/enviaremail.service.js";
import { GenerarPassword, GenerarUsuarioService } from "../generalservices/usergenerator.service.js";


export const CrearUsuarioService = async (data) => {
    try{

        const datosContactoEmpleado = await getDatosContactoEmpleadoDao(data.idInfoPersonal);
        
        const correoInstitucional = data.correoInstitucional || datosContactoEmpleado?.correoInstitucional;
        
        let user;
        if (correoInstitucional && correoInstitucional.includes('@')) {
            user = correoInstitucional.split('@')[0]; // Toma todo antes del @
        } else {
            // Fallback en caso de que no tenga correo institucional registrado
            const nombres = await ObtenerNombresDao(data.idEmpleado);
            user = await GenerarUsuarioService(nombres);
        }

        const pass = GenerarPassword();
        const idRol = data.isCoordinador == 1 ? 5 : 4;

        const dataUser = {
            idEmpleado: data.idEmpleado,
            idRol,
            user,
            pass,
            correo: correoInstitucional || datosContactoEmpleado?.correoPersonal
        }

        const idUsuario = await CrearUsuarioDao(dataUser);
        await EnviarMailServices(dataUser);

        return idUsuario;;
    }catch(error){
        console.error('Error al crear el usuario:', error); // Añadir log de error
        throw error;
 
    }
  }
