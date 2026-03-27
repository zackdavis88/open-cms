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

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.set('query parser', 'extended');
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

let BASE_STATIC_URL = '/static';
if (
  typeof process.env.BASE_STATIC_URL === 'string' &&
  process.env.BASE_STATIC_URL.startsWith('/')
) {
  BASE_STATIC_URL = process.env.BASE_STATIC_URL;
}
app.use(BASE_STATIC_URL, express.static('public'));

app.use(configureResponseHandlers);
configureDatabaseConnection(app)
  .then(() => {
    return configureRoutes(app);
  })
  .then(() => {
    app.listen(SERVER_PORT, () => {
      console.log(`Open CMS running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start', err);
    process.exit(1);
  });
