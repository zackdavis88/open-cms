import 'dotenv/config';
import { Sequelize, Utils, UUIDV4 } from 'sequelize';
import { User, initializeModels } from '../../src/models';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
const {
  SERVER_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOSTNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

export class TestHelper {
  sequelize: Sequelize;
  testUsernames: string[];
  request: TestAgent;

  constructor() {
    const connectionUrl = `postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}`;
    this.sequelize = new Sequelize(connectionUrl, {
      logging: false,
    });
    initializeModels(this.sequelize);
    this.testUsernames = [];
    this.request = request(`http://localhost:${SERVER_PORT}`);
  }

  generateUUID() {
    return String(Utils.toDefaultValue(UUIDV4()));
  }

  addTestUsername(testUsername: string) {
    this.testUsernames = this.testUsernames.concat(testUsername);
  }

  async removeTestData() {
    if (this.testUsernames.length) {
      await User.destroy({ where: { username: this.testUsernames } });
    }

    await this.sequelize.close();
    this.testUsernames = [];
  }

  async createTestUser(password = 'Password1', isActive = true) {
    const uuid = this.generateUUID();
    const username = uuid.slice(0, 11);

    const testUser = await User.create({
      username: username.toLowerCase(),
      displayName: username.toUpperCase(),
      hash: User.generateHash(password),
      isActive,
    });

    this.addTestUsername(testUser.username);
    return testUser;
  }
}

export { default as request } from 'supertest';
export { ERROR_TYPES } from '../../src/server/utils/errors';
export { User } from '../../src/models';
export { swaggerSpec } from '../../src/routes/discovery';
