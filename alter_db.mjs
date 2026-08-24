import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('database/vacaciones.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("ALTER TABLE excepciones_limite_vacaciones ADD COLUMN diasAutorizados INTEGER DEFAULT NULL;", (err) => {
    if (err) {
      console.error("Error altering table:", err.message);
    } else {
      console.log("Column diasAutorizados added successfully.");
    }
    db.close();
  });
});
