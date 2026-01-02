import 'dotenv/config';
import { Sequelize, Utils, UUIDV4 } from 'sequelize';
import { Project, User, initializeModels } from '../../src/models';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import jwt from 'jsonwebtoken';
import Blueprint, { BlueprintField } from '../../src/models/blueprint/blueprint';
import generateBlueprintField from './generateBlueprintField';

const {
  AUTH_SECRET,
  SERVER_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_HOSTNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

const DEFAULT_FIELDS = [
  generateBlueprintField({
    type: 'object',
    options: {
      name: 'defaultObjectField',
      isRequired: true,
      fields: [
        generateBlueprintField({
          type: 'object',
          options: {
            name: 'nestedObjectField1',
            fields: [
              generateBlueprintField({
                type: 'string',
                options: {
                  name: 'nestedObject1StringField',
                  minLength: 1,
                  maxLength: 25,
                },
              }),
            ],
          },
        }),
        generateBlueprintField({
          type: 'object',
          options: {
            name: 'nestedObjectField2',
            fields: [
              generateBlueprintField({
                type: 'object',
                options: {
                  fields: [
                    generateBlueprintField({
                      type: 'boolean',
                      options: { name: 'nestedObject2BooleanField' },
                    }),
                  ],
                },
              }),
            ],
          },
        }),
        generateBlueprintField({
          type: 'array',
          options: {
            name: 'nestedArrayField',
            arrayOf: generateBlueprintField({ type: 'number' }),
          },
        }),
        generateBlueprintField({
          type: 'string',
          options: { name: 'nestedStringField' },
        }),
      ],
    },
  }),
];

const DEFAULT_CONTENT = {
  defaultObjectField: {
    nestedObjectField1: {
      nestedObject1StringField: 'some string value',
    },
    nestedObjectField2: {
      nestedObject2BooleanField: true,
    },
    nestedArrayField: [1, 2, 3, 4],
  },
};

let BASE_URL = '/api';
if (typeof process.env.BASE_URL === 'string' && process.env.BASE_URL.startsWith('/')) {
  BASE_URL = process.env.BASE_URL;
}

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

  async createTestMembership({
    project,
    user,
    createdOn,
    createdBy,
    updatedBy,
    updatedOn,
    isAdmin,
    isWriter,
  }: {
    project: Project;
    user: User;
    createdOn?: Date;
    createdBy: User;
    updatedBy?: User;
    updatedOn?: Date;
    isAdmin?: boolean;
    isWriter?: boolean;
  }) {
    const membership = await project.createMembership({
      userId: user.id,
      createdById: createdBy.id,
      updatedById: updatedBy?.id,
      createdOn,
      updatedOn: updatedOn || updatedBy?.id ? new Date() : null,
      isAdmin: isAdmin || false,
      isWriter: isWriter || false,
    });
    membership.user = user;
    membership.createdBy = createdBy;
    membership.updatedBy = updatedBy;
    membership.project = project;
    return membership;
  }

  async createTestBlueprint({
    project,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    name,
    fields,
    isActive,
  }: {
    project: Project;
    createdOn?: Date;
    createdBy: User;
    updatedBy?: User;
    updatedOn?: Date;
    name?: string;
    fields?: BlueprintField[];
    isActive?: boolean;
  }) {
    const blueprint = await project.createBlueprint({
      createdOn,
      createdById: createdBy.id,
      updatedById: updatedBy?.id,
      updatedOn: updatedOn || updatedBy?.id ? new Date() : null,
      name: name || crypto.randomUUID(),
      fields: fields || DEFAULT_FIELDS,
      isActive,
    });
    blueprint.project = project;
    blueprint.createdBy = createdBy;
    blueprint.updatedBy = updatedBy;
    return blueprint;
  }

  async createTestComponent({
    project,
    blueprint,
    createdBy,
    createdOn,
    updatedBy,
    updatedOn,
    isActive,
    name,
    content,
    blueprintVersionId,
  }: {
    project: Project;
    blueprint: Blueprint;
    createdBy: User;
    createdOn?: Date;
    updatedOn?: Date;
    updatedBy?: User;
    isActive?: boolean;
    name?: string;
    content?: Record<string, unknown>;
    blueprintVersionId?: string;
  }) {
    const component = await project.createComponent({
      createdOn,
      createdById: createdBy.id,
      updatedById: updatedBy?.id,
      updatedOn: updatedOn || updatedBy?.id ? new Date() : null,
      name: name || crypto.randomUUID(),
      content: content || DEFAULT_CONTENT,
      isActive,
      blueprintVersionId,
      blueprintId: blueprint.id,
    });
    component.project = project;
    component.createdBy = createdBy;
    component.updatedBy = updatedBy;
    component.blueprint = blueprint;
    return component;
  }

  async createTestProject({
    user,
    name,
    description,
    isActive = true,
    createdOn,
    updatedOn,
  }: {
    user: User;
    name?: string;
    description?: string;
    isActive?: boolean;
    createdOn?: Date;
    updatedOn?: Date;
  }) {
    const testProject = await user.createProject({
      name: name || this.generateUUID(),
      description: description || null,
      isActive,
      createdOn,
      updatedOn,
    });

    await testProject.createMembership({
      userId: user.id,
      createdById: user.id,
      isAdmin: true,
    });

    this.addTestProjectId(testProject.id);
    return testProject;
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

  apiRoute(path: string) {
    const url = new URL(`${BASE_URL}${path}`, 'https://open-cms.com');
    return url.pathname;
  }
}
