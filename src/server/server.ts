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
    origin: [`http://localhost:${process.env.DOC_SERVER_PORT || 3001}`],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(configureResponseHandlers);
configureDatabaseConnection(app).then(() => {
  configureRoutes(app).then(() => {
    app.listen(process.env.SERVER_PORT);
  });
});

console.log(`Open CMS running on port ${process.env.SERVER_PORT}`);
