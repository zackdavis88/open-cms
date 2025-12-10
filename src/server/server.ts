import 'dotenv/config';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import {
  configureRoutes,
  configureResponseHandlers,
  configureDatabaseConnection,
} from './utils';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'src/routes/discovery';

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(
  cors({
    origin: [
      `http://localhost:${SERVER_PORT}`,
      'https://open-cms.com',
      'https://www.open-cms.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(configureResponseHandlers);
configureDatabaseConnection(app).then(() => {
  configureRoutes(app).then(() => {
    app.listen(SERVER_PORT);
  });
});

console.log(`Open CMS running on port ${SERVER_PORT}`);
