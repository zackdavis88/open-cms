import 'dotenv/config';
import { Sequelize } from 'sequelize';

const {
  SERVER_PORT,
  DATABASE_USERNAME,
  DATBASE_PASSWORD,
  DATABASE_HOSTNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

export class TestHelper {
  sequelize: Sequelize | null;

  constructor() {
    try {
      this.sequelize = new Sequelize(
        `postgres://${DATABASE_USERNAME}:${DATBASE_PASSWORD}@${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}_test`,
        {
          logging: false,
        },
      );
    } catch {
      this.sequelize = null;
    }
  }

  getServerUrl() {
    return `http://localhost:${SERVER_PORT}`;
  }
}

export { default as request } from 'supertest';
export { ERROR_TYPES } from '../../src/server/utils/errors';
