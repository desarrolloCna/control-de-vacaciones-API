import "dotenv/config";
import express from "express";
import cors from "cors"; // Importa cors como una función
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { catalogosRoute } from "./catalogosapi/routes/catalogos/catalogos.route.js";
import { dpiRoute } from "./apivacaciones/routes/dpi/informaciondpi.route.js";
import { infoEmpleRoute } from "./apivacaciones/routes/informacionpersonal/infopersonalemple.route.js";
import { familiaresRoute } from "./apivacaciones/routes/familiares/familiaremple.route.js";
import { nivelEducativoRoute } from "./apivacaciones/routes/niveleducativo/niveleducativo.routes.js";
import { pertenenciaSoLiRoute } from "./apivacaciones/routes/pertenenciasociolinguistica/pertenenciasoli.route.js";
import { datosMedicosRoute } from "./apivacaciones/routes/datosmedicos/datosmedicos.route.js";
import { empleadosRoute } from "./apivacaciones/routes/empleados/empleados.routes.js";
import { loginRout } from "./apivacaciones/routes/login/login.route.js";
import { diasFestivos } from "./apivacaciones/routes/diasfestivos/diasfestivos.routes.js";
import { VacationAppRoute } from "./apivacaciones/routes/vacationapp/vacationapp.routes.js";
import { reportsRoute } from "./apivacaciones/routes/reports/reports.routes.js";
import { suspensionesRoute } from "./apivacaciones/routes/suspensiones/suspensiones.routes.js";
import { coordinadoresRoute } from "./apivacaciones/routes/coordinadores/coordinadores.routes.js";
import { emailRoute } from "./apivacaciones/routes/email/emails.routes.js";
import { vacacionesespecialesRoute } from "./apivacaciones/modules/vacacionesespeciales/vacacionesespeciales.routes.js";
import { administracionvacacionesRoute } from "./apivacaciones/modules/gestionvacacionesrrhh/administracionvacaciones.route.js";
import { notificacionesRoute } from "./apivacaciones/routes/notificaciones/notificaciones.routes.js";
import { calendarioRoute } from "./apivacaciones/routes/calendario/calendario.routes.js";
import { autoservicioRouter } from "./apivacaciones/routes/autoservicio/autoservicio.routes.js";
import { adminRoute } from "./apivacaciones/routes/admin.routes.js";
import { setupSwagger } from "./docs/swagger.js";
import frasesRoutes from "./apivacaciones/routes/utilidades/frases.routes.js";

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

import { verifyToken } from "./middlewares/authmiddleware.js";

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
