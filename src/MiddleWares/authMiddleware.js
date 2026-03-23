import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Si la ruta es login, dejar pasar (por si llega aquí)
    if (req.path === '/login') return next();

    const bearerHeader = req.headers['authorization'];
    
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        jwt.verify(bearerToken, process.env.JWT_SECRET, (error, authData) => {
            if (error) {
                return res.status(403).json({ message: "Token inválido o expirado" });
            }
            req.user = authData;
            next();
        });
    } else {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token en los headers." });
    }
};
