import { Router } from "express";
import { getDiasFestivosController, createDiaFestivoController, updateDiaFestivoController, deleteDiaFestivoController } from "../../controller/diasfestivos/diasfestivos.controller.js";

export const diasFestivos = Router();

diasFestivos.get('/getDiasFestivos', getDiasFestivosController);
diasFestivos.post('/diasFestivos', createDiaFestivoController);
diasFestivos.put('/diasFestivos/:id', updateDiaFestivoController);
diasFestivos.delete('/diasFestivos/:id', deleteDiaFestivoController);
