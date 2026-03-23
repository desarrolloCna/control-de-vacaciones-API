import { Connection } from "../../dao/connection/conexionsqlite.dao.js";

// DAO interno auxiliar
export const actualizarCelularDao = async (idEmpleado, nuevoCelular) => {
  const result = await Connection.execute(
    `UPDATE infoPersonalEmpleados SET numeroCelular = ? WHERE idInfoPersonal = (SELECT idInfoPersonal FROM empleados WHERE idEmpleado = ?)`,
    [nuevoCelular, idEmpleado]
  );
  return result.rowsAffected;
};

export const cambiarPasswordDao = async (idEmpleado, newPassword) => {
  const result = await Connection.execute(
    `UPDATE usuarios SET pass = ?, requiereCambioPass = 0 WHERE idEmpleado = ?`,
    [newPassword, idEmpleado]
  );
  return result.rowsAffected;
};

// Controllers
export const actualizarCelularController = async (req, res) => {
  try {
    const { idEmpleado, nuevoCelular } = req.body;
    if (!idEmpleado || !nuevoCelular) return res.status(400).json({ error: "Faltan parámetros" });
    
    await actualizarCelularDao(idEmpleado, nuevoCelular);
    res.status(200).json({ message: "Celular actualizado correctamente" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarPasswordController = async (req, res) => {
  try {
    const { idEmpleado, newPassword } = req.body;
    if (!idEmpleado || !newPassword) return res.status(400).json({ error: "Faltan parámetros" });

    // En este sistema guardamos el pass directamente o con bcript si se prefiere.
    // Viendo el login.dao original, parece que se guarda el texto plano o ya hasheado desde el front.
    // Usaré el valor del campo tal cual viene.
    
    await cambiarPasswordDao(idEmpleado, newPassword);
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};
