import { loginServices } from "../../services/login/login.services.js";
import jwt from "jsonwebtoken";


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
