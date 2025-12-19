import 'dotenv/config';
import { Sequelize, Utils, UUIDV4 } from 'sequelize';
import { Project, User, initializeModels } from '../../src/models';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwt from 'jsonwebtoken';
const {
  AUTH_SECRET,
  SERVER_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOSTNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

interface TokenDataOverride {
  id?: string;
  apiKey?: string;
  iat?: number;
  exp?: number;
}

export class TestHelper {
  sequelize: Sequelize;
  testUsernames: string[];
  testProjectIds: string[];
  request: TestAgent;

  constructor() {
    const connectionUrl = `postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOSTNAME}:${DATABASE_PORT}/${DATABASE_NAME}`;
    this.sequelize = new Sequelize(connectionUrl, {
      logging: false,
    });
    initializeModels(this.sequelize);
    this.testUsernames = [];
    this.testProjectIds = [];
    this.request = request(`http://localhost:${SERVER_PORT}`);
  }

  generateUUID() {
    return String(Utils.toDefaultValue(UUIDV4()));
  }

  addTestUsername(testUsername: string) {
    this.testUsernames = this.testUsernames.concat(testUsername);
  }

  addTestProjectId(projectId: string) {
    this.testProjectIds = this.testProjectIds.concat(projectId);
  }

  async removeTestData() {
    if (this.testUsernames.length) {
      await User.destroy({ where: { username: this.testUsernames } });
    }

    if (this.testProjectIds.length) {
      await Project.destroy({ where: { id: this.testProjectIds } });
    }

    await this.sequelize.close();
    this.testUsernames = [];
    this.testProjectIds = [];
  }

  async createTestUser({
    username,
    password = 'Password1',
    isActive = true,
    createdOn,
    updatedOn,
  }: {
    username?: string;
    password?: string;
    isActive?: boolean;
    createdOn?: Date;
    updatedOn?: Date;
  } = {}) {
    const uuid = this.generateUUID();
    const displayName = username || uuid.slice(0, 11).toUpperCase();

    const testUser = await User.create({
      username: displayName.toLowerCase(),
      displayName,
      hash: User.generateHash(password),
      isActive,
      createdOn,
      updatedOn,
    });

    this.addTestUsername(testUser.username);
    return testUser;
  }

  generateAuthToken(
    user: User,
    dataOverride?: TokenDataOverride | string,
    secretOverride?: string,
  ) {
    const tokenData = {
      id: user.id,
      apiKey: user.apiKey,
    };

    let token: string;
    if (typeof dataOverride === 'string') {
      token = jwt.sign(dataOverride, secretOverride || AUTH_SECRET || '');
    } else {
      token = jwt.sign(
        { ...tokenData, ...(dataOverride ?? {}) },
        secretOverride || AUTH_SECRET || '',
      );
    }

    return `Bearer ${token}`;
  }
}

export { default as request } from 'supertest';
export { ERROR_TYPES } from '../../src/server/utils/errors';
export { User } from '../../src/models';
export { swaggerSpec } from '../../src/routes/discovery';
export { UserData, ProjectData, MembershipData } from '../../src/types';
