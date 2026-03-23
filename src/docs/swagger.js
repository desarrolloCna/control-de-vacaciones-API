import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Control de Vacaciones (VACAS)',
      version: '1.0.0',
      description: 'Documentación oficial de los Endpoints para el sistema de vacaciones del CNA.',
      contact: {
        name: 'Soporte',
        email: 'soporte@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor Local (Desarrollo)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Rutas donde buscará comentarios JSDoc para construir la documentación:
  apis: ['./src/ApiVacaciones/Controller/**/*.js', './src/routes/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));
  console.log('✅ Documentación Swagger disponible en: http://localhost:5000/api-docs');
};
