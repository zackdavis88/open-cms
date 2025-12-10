import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../src/routes/discovery';

const app = express();
const port = process.env.DOC_SERVER_PORT || 3001;

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`OpenAPI docs available at http://localhost:${port}/`);
});
