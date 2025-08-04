// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RIMAC Appointments API',
      version: '1.0.0',
      description: 'Documentación de la API para agendamiento de citas médicas',
    },
    servers: [
      {
        url: 'https://cbhsv6dgwf.execute-api.us-east-1.amazonaws.com/dev',
        description: 'API desplegada en AWS',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor local',
      }
    ],
  },
  apis: ['./src/handlers/*.ts'], // Asegúrate de que aquí están los endpoints anotados con Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
