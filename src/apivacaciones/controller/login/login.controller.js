import { loginServices } from "../../services/login/login.services.js";
import jwt from "jsonwebtoken";

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autentica a un usuario y devuelve un token JWT
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario o correo
 *                 example: jsmith
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userLogin:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 200
 *                     message:
 *                       type: string
 *                     token:
 *                       type: string
 *       401:
 *         description: Credenciales inválidas
 */
export const loginController = async (req, res) => {
    try{
        const userData = await loginServices(req.body);
        
        const token = jwt.sign(
            { idEmpleado: userData.idEmpleado, idRol: userData.idRol, usuario: userData.usuario, puesto: userData.puesto },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
        );

        const  userLogin = {
            status: 200,
            message: "Login realizado correctamente",
            userData,
            token
        }
        res
        .status(200)
        .json({userLogin});

    }catch(error){
        const status = error?.codRes || 500;
        const userLogin = {
            codErr: error.codRes,
            error: error?.message || error
        }

        res.status(status).json({ userLogin });
    }
}
