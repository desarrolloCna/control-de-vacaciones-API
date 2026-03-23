import { Router } from "express";
import { getFraseAleatoria } from "../../controller/utilidades/frases.controller.js";

const router = Router();

// Endpoint para obtener una frase motivadora aleatoria
router.get("/frases-motivadoras", getFraseAleatoria);

export default router;
