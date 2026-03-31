/**
 * Middleware para autorizar acceso basado en roles.
 * Debe ir DESPUÉS de verifyToken (ya que requiere req.user).
 *
 * @param  {...number} allowedRoles - IDs de los roles permitidos (ej. 1, 3)
 */
export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Verificar que req.user exista (setteado por verifyToken)
    if (!req.user || !req.user.idRol) {
      return res.status(401).json({ message: "Usuario no autenticado o token inválido." });
    }

    // Verificar si el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(req.user.idRol)) {
      return res.status(403).json({ 
        message: "Acceso denegado: No tienes los permisos necesarios para realizar esta acción.",
        requiredRoles: allowedRoles,
        userRole: req.user.idRol
      });
    }

    // Si tiene permiso, continuar al siguiente middleware / controlador
    next();
  };
};
