const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('src/apivacaciones/config/database/vacaciones.db');

const query = `
    SELECT e.idEmpleado, e.fechaIngreso, ip.primerNombre, ip.primerApellido, hv.periodo, hv.diasDisponibles
    FROM empleados e
    JOIN infopersonalEmpleados ip ON ip.idInfoPersonal = e.idInfoPersonal
    LEFT JOIN historial_vacaciones hv ON hv.idEmpleado = e.idEmpleado
    WHERE ip.primerNombre LIKE '%Rene%' AND ip.primerApellido LIKE '%Melgar%'
`;

db.all(query, [], (err, rows) => {
    if (err) console.error(err);
    else console.log(rows);
});
