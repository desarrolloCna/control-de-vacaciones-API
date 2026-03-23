import { Router } from "express";
import { enviarEmailController } from "../../controller/email/emails.controller.js";

export const emailRoute = Router();

emailRoute.post('/enviarEmail', enviarEmailController);
