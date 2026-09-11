import { Connection } from "../../dao/connection/conexionsqlite.dao.js";
import bcrypt from "bcryptjs";

// DAO interno auxiliar
export const actualizarCelularDao = async (idEmpleado, nuevoCelular) => {
  const result = await Connection.execute(
    `UPDATE infoPersonalEmpleados SET numeroCelular = ? WHERE idInfoPersonal = (SELECT idInfoPersonal FROM empleados WHERE idEmpleado = ?)`,
    [nuevoCelular, idEmpleado]
  );
  return result.rowsAffected;
};

export const obtenerPassActualDao = async (idEmpleado) => {
  const result = await Connection.execute(
    `SELECT pass FROM usuarios WHERE idEmpleado = ?`,
    [idEmpleado]
  );
  return result.rows[0]?.pass;
};

export const cambiarPasswordDao = async (idEmpleado, newPassword) => {
  // Hashear la nueva contraseña antes de guardar
  const hashedPass = await bcrypt.hash(newPassword, 10);
  const result = await Connection.execute(
    `UPDATE usuarios SET pass = ?, requiereCambioPass = 0 WHERE idEmpleado = ?`,
    [hashedPass, idEmpleado]
  );
  return result.rowsAffected;
};

// Controllers
export const actualizarCelularController = async (req, res) => {
  try {
    // El idEmpleado se toma del token verificado, nunca del body: evita que un
    // usuario autenticado modifique el celular de otro empleado (IDOR).
    const idEmpleado = req.user.idEmpleado;
    const { nuevoCelular } = req.body;
    if (!idEmpleado || !nuevoCelular) return res.status(400).json({ error: "Faltan parámetros" });

    await actualizarCelularDao(idEmpleado, nuevoCelular);
    res.status(200).json({ message: "Celular actualizado correctamente" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

export const cambiarPasswordController = async (req, res) => {
  try {
    // El idEmpleado se toma del token verificado, nunca del body: evita que un
    // usuario autenticado cambie la contraseña de otro empleado (IDOR).
    const idEmpleado = req.user.idEmpleado;
    const { currentPassword, newPassword } = req.body;
    if (!idEmpleado || !currentPassword || !newPassword) return res.status(400).json({ error: "Faltan parámetros" });

    const storedPass = await obtenerPassActualDao(idEmpleado);
    if (!storedPass) return res.status(404).json({ error: "Usuario no encontrado" });

    // Comparación híbrida (mismo criterio que el login): bcrypt si ya está hasheada, texto plano si es legacy.
    const esBcrypt = storedPass.startsWith('$2a$') || storedPass.startsWith('$2b$');
    const passwordValida = esBcrypt
      ? await bcrypt.compare(currentPassword, storedPass)
      : currentPassword === storedPass;

    if (!passwordValida) {
      return res.status(401).json({ error: "La contraseña actual no es correcta" });
    }

    await cambiarPasswordDao(idEmpleado, newPassword);
    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};
