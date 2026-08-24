import { Connection } from "../connection/conexionsqlite.dao.js";

export const getResumenVacacionesDao = async () => {
  try {
    const query = `
      WITH UltimoBalance AS (
        SELECT idEmpleado, periodo, diasDisponiblesTotales,
               ROW_NUMBER() OVER(PARTITION BY idEmpleado, periodo ORDER BY idHistorial DESC) as rn
        FROM HistorialVacaciones
      )
      SELECT 
        em.idEmpleado, 
        (inf.primerNombre || ' ' || COALESCE(inf.segundoNombre, '') || ' ' || inf.primerApellido || ' ' || COALESCE(inf.segundoApellido, '')) AS nombre,
        em.puesto,
        em.unidad,
        em.renglon,
        strftime('%d/%m/%Y', em.fechaIngreso) AS fechaIngreso,
        ub.periodo,
        ub.diasDisponiblesTotales
      FROM empleados em
      JOIN infoPersonalEmpleados inf ON em.idInfoPersonal = inf.idInfoPersonal
      LEFT JOIN UltimoBalance ub ON em.idEmpleado = ub.idEmpleado AND ub.rn = 1
      WHERE em.estado = 'A' AND em.renglon IN ('011', '022')
      ORDER BY em.unidad, em.idEmpleado, ub.periodo;
    `;

    const result = await Connection.execute(query);
    
    // El resultado tendrá múltiples filas por empleado (una por cada periodo).
    // Para facilitar el trabajo en el frontend o backend, lo agrupamos por empleado.
    const groupedByEmployee = {};

    result.rows.forEach(row => {
      const cleanName = row.nombre.replace(/\s+/g, ' ').trim();
      
      if (!groupedByEmployee[row.idEmpleado]) {
        groupedByEmployee[row.idEmpleado] = {
          idEmpleado: row.idEmpleado,
          nombre: cleanName,
          puesto: row.puesto,
          unidad: row.unidad,
          renglon: row.renglon,
          fechaIngreso: row.fechaIngreso,
          periodos: {},
          total: 0
        };
      }

      if (row.periodo) {
        groupedByEmployee[row.idEmpleado].periodos[row.periodo] = row.diasDisponiblesTotales;
        groupedByEmployee[row.idEmpleado].total += row.diasDisponiblesTotales;
      }
    });

    return Object.values(groupedByEmployee);

  } catch (error) {
    console.log("Error en getResumenVacacionesDao:", error);
    throw error;
  }
};
