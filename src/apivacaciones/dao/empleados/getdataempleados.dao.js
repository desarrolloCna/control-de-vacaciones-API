import { Connection } from "../connection/conexionsqlite.dao.js";

export const getDatosContactoEmpleadoDao = async (idInfoPersonal) => {
  try {
    const query = "SELECT numeroCelular, correoPersonal FROM infoPersonalEmpleados WHERE idInfoPersonal = ?;";
    
    const result = await Connection.execute(query, [idInfoPersonal]);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en getDatosContactoEmpleadoDao:", error);
    throw error;
  }
};

export const employeesListDao = async () => {
  try {
    const query = `
      SELECT 
          em.idEmpleado, 
          inf.idInfoPersonal,
          dp.numeroDocumento,
          (inf.primerNombre || ' ' || inf.segundoNombre || ' ' || 
           inf.primerApellido || ' ' || inf.segundoApellido) AS Nombres,
          inf.correoPersonal AS correo, 
          inf.numeroCelular AS celular,
          em.puesto AS puesto, 
          em.unidad AS unidad, 
          em.renglon AS renglon,
          em.tipoContrato AS tipoContrato, 
          em.estado AS estado,
          strftime('%d/%m/%Y', em.fechaIngreso) AS fechaIngresoLabores,
          COALESCE((SELECT SUM(diasDisponibles) FROM historial_vacaciones WHERE idEmpleado = em.idEmpleado AND tipoRegistro = 1), 0) AS diasTotales
      FROM 
          dpiEmpleados dp
      INNER JOIN 
          infoPersonalEmpleados inf ON dp.idDpi = inf.idDpi
      INNER JOIN 
          empleados em ON inf.idInfoPersonal = em.idInfoPersonal
      WHERE em.estado = 'A' 
      AND em.idEmpleado NOT IN (SELECT idEmpleado FROM usuarios WHERE idRol IN (1, 3) AND idEmpleado IS NOT NULL)
      AND em.idEmpleado NOT IN (
          SELECT idEmpleado FROM suspensiones WHERE tipoSuspension = 'baja' AND estado = 'A'
      )
      ORDER BY 
          em.idEmpleado DESC;
    `;

    const result = await Connection.execute(query);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows;
    }
  } catch (error) {
    console.log("Error en employeesListDao:", error);
    throw error;
  }
};

export const obtenerDatosLaboralesDao = async (idInfoPersonal) => {
  try {
    const query = `SELECT idEmpleado, puesto, salario, fechaIngreso, 
                    correoInstitucional, extensionTelefonica, 
                    unidad, renglon, observaciones, coordinacion, tipoContrato,
                    numeroCuentaCHN, numeroContrato, numeroActa,
                    numeroAcuerdo,
                    COALESCE((
                        SELECT 
                            SUM(CASE WHEN tipoRegistro = 1 THEN diasDisponibles ELSE 0 END) - 
                            SUM(CASE WHEN tipoRegistro = 2 THEN diasSolicitados ELSE 0 END)
                        FROM historial_vacaciones 
                        WHERE idEmpleado = em.idEmpleado
                    ), 0) as diasDisponibles,
                    0 as diasProporcionales
                    FROM empleados em
                    WHERE idInfoPersonal = ?;`;

    const result = await Connection.execute(query, [idInfoPersonal]);
    
    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (error) {
    console.log("Error en obtenerDatosLaboralesDao:", error);
    throw error;
  }
};
