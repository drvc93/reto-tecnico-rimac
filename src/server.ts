
import { swaggerUi, swaggerSpec } from './config/swagger';
import { configure } from '@vendia/serverless-express';
import express from 'express';
import awsServerlessExpress from '@vendia/serverless-express';
import cors from 'cors';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

const app = express();
app.use(cors()); 
app.use(express.json());

// Swagger UI disponible en /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Endpoints de ejemplo
app.post('/appointments', (req, res) => {
  // lógica para crear cita
  res.status(201).json({ message: 'Cita creada exitosamente' });
});

/**
 * @swagger
 * /appointments/{insuredId}:
 *   get:
 *     summary: Listar citas por código de asegurado
 *     parameters:
 *       - in: path
 *         name: insuredId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de citas
 */
app.get('/appointments/:insuredId', (req, res) => {
  const { insuredId } = req.params;
  // lógica para obtener citas
  res.status(200).json({ appointments: [], insuredId });
});

// Solo inicia en local (para desarrollo)
if (process.env.NODE_ENV !== 'production') {
  const port = 3000;
  app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
    console.log(`📚 Documentación Swagger en http://localhost:${port}/docs`);
  });
}

// Handler para AWS Lambda
const server = awsServerlessExpress({ app });
export const handler = awsServerlessExpress({ app });