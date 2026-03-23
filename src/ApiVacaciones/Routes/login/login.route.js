import { Router } from "express";
import { loginController } from "../../controller/login/login.controller.js";
import { requestPasswordResetController } from "../../controller/usuarios/passwordreset.controller.js";

export const loginRout = Router();

loginRout.post('/login', loginController);
loginRout.post('/request-password-reset', requestPasswordResetController);
