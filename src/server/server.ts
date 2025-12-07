import 'dotenv/config';
import express from 'express';
import methodOverride from 'method-override';
import morgan from 'morgan';
import {
  configureRoutes,
  configureResponseHandlers,
  configureDatabaseConnection,
} from './utils';

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride());
app.use(morgan('dev'));

app.use(configureResponseHandlers);
configureDatabaseConnection(app).then(() => {
  configureRoutes(app).then(() => {
    app.listen(process.env.SERVER_PORT);
  });
});

console.log(`Open CMS running on port ${process.env.SERVER_PORT}`);
