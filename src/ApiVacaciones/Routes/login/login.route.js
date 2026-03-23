import { Router } from "express";
import { loginController } from "../../Controller/login/login.controller.js";
import { requestPasswordResetController } from "../../Controller/usuarios/PasswordReset.controller.js";

export const loginRout = Router();

loginRout.post('/login', loginController);
loginRout.post('/request-password-reset', requestPasswordResetController);