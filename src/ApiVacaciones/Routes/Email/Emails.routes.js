import { Router } from "express";
import { enviarEmailController } from "../../Controller/Email/Emails.controller.js";

export const emailRoute = Router();

emailRoute.post('/enviarEmail', enviarEmailController);
