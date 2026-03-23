import "dotenv/config";
import express from "express";
import cors from "cors"; // Importa cors como una función
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { catalogosRoute } from "./CatalogosAPI/routes/catalogos/catalogos.route.js";
import { dpiRoute } from "./ApiVacaciones/Routes/DPI/informacionDPI.route.js";
import { infoEmpleRoute } from "./ApiVacaciones/Routes/informacionPersonal/infoPersonalEmple.route.js";
import { familiaresRoute } from "./ApiVacaciones/Routes/familiares/familiarEmple.route.js";
import { nivelEducativoRoute } from "./ApiVacaciones/Routes/nivelEducativo/nivelEducativo.routes.js";
import { pertenenciaSoLiRoute } from "./ApiVacaciones/Routes/pertenenciaSociolinguistica/pertenenciaSoli.route.js";
import { datosMedicosRoute } from "./ApiVacaciones/Routes/datosMedicos/datosMedicos.route.js";
import { empleadosRoute } from "./ApiVacaciones/Routes/empleados/empleados.routes.js";
import { loginRout } from "./ApiVacaciones/Routes/login/login.route.js";
import { diasFestivos } from "./ApiVacaciones/Routes/DiasFestivos/DiasFestivos.routes.js";
import { VacationAppRoute } from "./ApiVacaciones/Routes/VacationApp/VacationApp.routes.js";
import { reportsRoute } from "./ApiVacaciones/Routes/Reports/Reports.routes.js";
import { suspensionesRoute } from "./ApiVacaciones/Routes/Suspensiones/Suspensiones.routes.js";
import { coordinadoresRoute } from "./ApiVacaciones/Routes/Coordinadores/Coordinadores.routes.js";
import { emailRoute } from "./ApiVacaciones/Routes/Email/Emails.routes.js";
import { vacacionesespecialesRoute } from "./ApiVacaciones/modules/vacacionesespeciales/vacacionesespeciales.routes.js";
import { administracionvacacionesRoute } from "./ApiVacaciones/modules/GestionVacacionesRRHH/administracionvacaciones.route.js";
import { notificacionesRoute } from "./ApiVacaciones/Routes/Notificaciones/Notificaciones.routes.js";
import { calendarioRoute } from "./ApiVacaciones/Routes/Calendario/Calendario.routes.js";
import { autoservicioRouter } from "./ApiVacaciones/Routes/Autoservicio/autoservicio.routes.js";
import { adminRoute } from "./ApiVacaciones/Routes/admin.routes.js";
import { setupSwagger } from "./docs/swagger.js";
import frasesRoutes from "./ApiVacaciones/Routes/utilidades/frases.routes.js";

const app = express();
app.use(helmet()); // Protecciones básicas HTTP

// Protección CORS primero para evitar bloqueos falsos
app.use(cors());

// Setup de Swagger (Documentación Interactiva)
setupSwagger(app);

// Límite de peticiones temporalmente alto para desarrollo y pruebas
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10000, 
    message: { message: 'Demasiadas peticiones, intenta de nuevo más tarde.' }
});
app.use('/api/', limiter);

app.use(express.json());

import { verifyToken } from "./MiddleWares/authMiddleware.js";

// --- PUBLIC ROUTES ---
app.use('/api/', loginRout);

// --- PROTECTED ROUTES MIDDLEWARE ---
app.use('/api/', verifyToken);

// --- RUTAS DE ADMINISTRACIÓN (MÁXIMA PRIORIDAD) ---
app.use('/api/admin', adminRoute);

//catalogos.
app.use('/api/', catalogosRoute);
app.use('/api/', diasFestivos);

//acciones
app.use('/api/', dpiRoute);
app.use('/api/', infoEmpleRoute);
app.use('/api/', familiaresRoute);
app.use('/api/', nivelEducativoRoute);
app.use('/api/', pertenenciaSoLiRoute);
app.use('/api/', datosMedicosRoute);
app.use('/api/', empleadosRoute);
app.use('/api/', VacationAppRoute);
app.use('/api/', suspensionesRoute);
app.use('/api/', coordinadoresRoute);
app.use('/api/', emailRoute);
app.use('/api/', vacacionesespecialesRoute);
app.use('/api/', administracionvacacionesRoute);
app.use('/api/', notificacionesRoute);
app.use('/api/', calendarioRoute);
app.use('/api/', autoservicioRouter);
app.use('/api/', frasesRoutes);



//Reportes
app.use('/api/', reportsRoute);


// Exportar para Vercel
export default app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/api/`);
    });
}
