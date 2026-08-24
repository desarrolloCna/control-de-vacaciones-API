const db = require('better-sqlite3')('c:/Users/jcurruchiche/Desktop/VACAS/control-de-vacaciones-API/database.sqlite');

const duplicates = db.prepare(`
    SELECT idEmpleado, idSolicitud, periodo, COUNT(*) as count, GROUP_CONCAT(idHistorial) as historiales
    FROM historial_vacaciones
    WHERE tipoRegistro = 2
    GROUP BY idEmpleado, idSolicitud, periodo
    HAVING count > 1
`).all();

console.log('Duplicates found:', duplicates);

let deletedCount = 0;
duplicates.forEach(dup => {
    // Leave the first one, delete the rest
    const ids = dup.historiales.split(',');
    const idsToDelete = ids.slice(1);
    
    idsToDelete.forEach(id => {
        db.prepare('DELETE FROM historial_vacaciones WHERE idHistorial = ?').run(id);
        deletedCount++;
        console.log(`Deleted duplicate debit idHistorial: ${id}`);
    });
});

console.log(`Total duplicate debits deleted: ${deletedCount}`);
