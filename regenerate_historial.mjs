import { Connection } from "./src/apivacaciones/dao/connection/conexionsqlite.dao.js";
import dayjs from "dayjs";

const diasHastaFinDeAnio = (fechaIncio) => {
  const fInicio = dayjs(fechaIncio);
  const finAnio = dayjs(`${fInicio.year()}-12-31`);
  return finAnio.diff(fInicio, "day") + 1;
};

const diasIngresoHastaDiaEnCurso = (fechaInicio) => {
  const fInicio = dayjs(fechaInicio);
  const actual = dayjs();
  return actual.diff(fInicio, "day") + 1;
};

const getDiasAcumuladosAnioAtrasadoIncompleto = (fechaIngreso) => {
  const cantidadDiasAnioIncompleto = diasHastaFinDeAnio(fechaIngreso);
  return Math.min(20, Math.round((cantidadDiasAnioIncompleto * 20) / 365));
};

const getDiasAnioEnCursoIncompleto = (anio) => {
  const fechaInicioAnioEnCurso = `${anio}-01-01`;
  const cantidadDiasIngresoAUltimoMes = diasIngresoHastaDiaEnCurso(fechaInicioAnioEnCurso);
  const sumatoria = (cantidadDiasIngresoAUltimoMes * 20) / 365;
  return Math.min(20, Math.round(sumatoria));
};

const getDiasInicioAnioEnCurso = (fechaIngreso) => {
  const cantidadDiasIngresoAUltimoMes = diasIngresoHastaDiaEnCurso(fechaIngreso);
  const sumatoria = (cantidadDiasIngresoAUltimoMes * 20) / 365;
  return Math.min(20, Math.round(sumatoria));
};

async function run() {
    try {
        const empRes = await Connection.execute(`
            SELECT idEmpleado, idInfoPersonal, fechaIngreso 
            FROM empleados 
            WHERE fechaIngreso IS NOT NULL AND fechaIngreso != ''
        `);
        
        const tx = await Connection.transaction("write");
        
        await tx.execute("DELETE FROM historial_vacaciones");
        
        const anioEnCurso = dayjs().year();
        let totalInserted = 0;
        
        for (const emp of empRes.rows) {
            const hireDate = dayjs(emp.fechaIngreso);
            if (!hireDate.isValid()) continue;
            
            const anioIngreso = hireDate.year();
            
            if (anioIngreso > anioEnCurso) {
                continue;
            }
            
            let sumatoriaAcumulada = 0;
            
            for (let anio = anioIngreso; anio <= anioEnCurso; anio++) {
                let diasPeriodo = 0;
                
                if (anio === anioIngreso && anioIngreso === anioEnCurso) {
                    diasPeriodo = getDiasInicioAnioEnCurso(emp.fechaIngreso);
                } else if (anio === anioIngreso) {
                    diasPeriodo = getDiasAcumuladosAnioAtrasadoIncompleto(emp.fechaIngreso);
                } else if (anio === anioEnCurso) {
                    diasPeriodo = getDiasAnioEnCursoIncompleto(anioEnCurso);
                } else {
                    diasPeriodo = 20;
                }
                
                sumatoriaAcumulada += diasPeriodo;
                
                await tx.execute({
                    sql: "INSERT INTO historial_vacaciones (idEmpleado, idInfoPersonal, periodo, diasAcreditados, diasDebitados, diasDisponibles, sumatoriaDias, tipoRegistro, estado) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'A')",
                    args: [
                        emp.idEmpleado,
                        emp.idInfoPersonal,
                        anio,
                        diasPeriodo,
                        0,
                        diasPeriodo,
                        sumatoriaAcumulada
                    ]
                });
                totalInserted++;
            }
        }
        
        await tx.commit();
        console.log(`Regenerados ${totalInserted} registros de historial para ${empRes.rows.length} empleados.`);
    } catch(e) {
        console.error("Error regenerando historial:", e);
    }
}
run();
