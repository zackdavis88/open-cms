import { Express } from 'express';
import { Sequelize } from 'sequelize';
import { initializeModelsAndSync } from 'src/models';

const configureDatabaseConnection = async (app: Express) => {
  const {
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    DATABASE_HOSTNAME,
    DATABASE_PORT,
    DATABASE_NAME,
  } = process.env;

  const connectionUrl = `postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}`;

  const sequelize = new Sequelize(connectionUrl, {
    logging: false,
  });

  // TODO: Initialize models here and associations here, once they exist.
  await initializeModelsAndSync(sequelize);

  app.use((req, _res, next) => {
    req.sequelize = sequelize;
    return next();
  });
};

export default configureDatabaseConnection;
