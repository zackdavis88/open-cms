import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  generateBlueprintField,
  Blueprint,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/blueprints/:blueprintId');
const request = testHelper.request;

const generatedBlueprintFields = [
  generateBlueprintField({
    type: 'object',
    options: {
      name: 'rootObject1',
      fields: [
        generateBlueprintField({
          type: 'object',
          options: {
            fields: [
              generateBlueprintField({
                type: 'string',
                options: { minLength: 1, maxLength: 25 },
              }),
            ],
          },
        }),
        generateBlueprintField({
          type: 'object',
          options: {
            fields: [
              generateBlueprintField({
                type: 'date',
              }),
            ],
          },
        }),
        generateBlueprintField({
          type: 'object',
          options: {
            fields: [
              generateBlueprintField({
                type: 'object',
                options: {
                  fields: [generateBlueprintField({ type: 'boolean' })],
                },
              }),
            ],
          },
        }),
        generateBlueprintField({
          type: 'array',
          options: { arrayOf: generateBlueprintField({ type: 'number' }) },
        }),
        generateBlueprintField({ type: 'string' }),
      ],
    },
  }),
];

describe('Update Blueprint', () => {
  describe(`PATCH ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let adminAuthToken: string;
    let writerAuthToken: string;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let testBlueprint: Blueprint;
    let deletedBlueprint: Blueprint;
    let requestPayload: {
      name?: unknown;
      fields?: unknown;
    };

    beforeAll(async () => {
      adminUser = await testHelper.createTestUser();
      writerUser = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();
      readUser = await testHelper.createTestUser();
      deletedProject = await testHelper.createTestProject({
        isActive: false,
        user: adminUser,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testHelper.createTestMembership({
        project: testProject,
        user: writerUser,
        createdBy: adminUser,
        isWriter: true,
      });
      await testHelper.createTestMembership({
        project: testProject,
        user: readUser,
        createdBy: adminUser,
      });

      testBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
      });

      deletedBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        isActive: false,
      });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/blueprints/${testBlueprint.id}`,
      );
      requestPayload = {
        name: 'Updated Name',
        fields: generatedBlueprintFields,
      };
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.patch(apiRoute).send(requestPayload).expect(
        401,
        {
          error: 'authorization header is missing from input',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject when project id is not a valid uuid', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/SomethingWrong/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested project id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when project is not found', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testHelper.generateUUID()}/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested project not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when project is deleted', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${deletedProject.id}/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested project not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when the user is not a project member', (done) => {
      request.patch(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have write permissions', (done) => {
      request.patch(apiRoute).set('authorization', readerAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject when blueprint id is not a valid uuid', (done) => {
      request
        .patch(testHelper.apiRoute(`/projects/${testProject.id}/blueprints/wrong`))
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested blueprint id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when blueprint is not found', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when blueprint is deleted', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/blueprints/${deletedBlueprint.id}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when there is nothing to update', (done) => {
      request.patch(apiRoute).set('authorization', writerAuthToken).expect(
        422,
        {
          error: 'input contains nothing to update',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when name is not a string', (done) => {
      requestPayload.name = 111;
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'name must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when name is less than 3 characters', (done) => {
      requestPayload.name = 'a';
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'name must be 3 - 30 characters in length',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when name is more than 30 characters', (done) => {
      requestPayload.name = Array(31).fill('a').join('');
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'name must be 3 - 30 characters in length',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when name contains invalid characters', (done) => {
      requestPayload.name = '👍👍👍';
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'name contains invalid characters',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when fields is not an array of objects', (done) => {
      requestPayload.fields = {};
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'fields must be an array of blueprint field objects',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when fields is an empty array', (done) => {
      requestPayload.fields = [];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'fields must be an array of blueprint field objects',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when fields contains non-objects', (done) => {
      requestPayload.fields = [generateBlueprintField({ type: 'date' }), 'somethingElse'];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root fields must be a blueprint field object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field name is not a string', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'array' }), name: 12345 },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root fields must be a blueprint field object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field name is empty-string', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'object' }), name: '' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root field name must be 1 - 50 characters in length',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field name is over 50 characters', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({ type: 'date' }),
          name: Array(51).fill('a').join(''),
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root field name must be 1 - 50 characters in length',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field name contains invalid characters', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({ type: 'string' }),
          name: '👍',
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root field name contains invalid characters',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field name is duplicated', (done) => {
      requestPayload.fields = [
        generateBlueprintField({ type: 'string', options: { name: 'testName' } }),
        generateBlueprintField({ type: 'date', options: { name: 'testName' } }),
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root fields contains duplicate name: testName',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field isRequired is not a boolean', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'string' }), isRequired: 'yes' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root field isRequired must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field type is missing', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'string' }), type: undefined },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error:
              'root field type must be one of: string, number, boolean, date, array, object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field type is not a string', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'string' }), type: 3478924 },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error:
              'root field type must be one of: string, number, boolean, date, array, object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when field type is not valid', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'number' }), type: 'notAValidType' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error:
              'root field type must be one of: string, number, boolean, date, array, object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string field regex is not a string', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'string' }), regex: true },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root string field regex must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string field regex is not valid', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'string' }), regex: '^test\\' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root string field regex is invalid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string field minLength is greater than maxLength', (done) => {
      requestPayload.fields = [
        generateBlueprintField({
          type: 'string',
          options: { minLength: 5, maxLength: 3 },
        }),
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root string field maxLength cannot be less than field minLength',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string field minLength is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'string',
          }),
          minLength: '5',
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root string field minLength must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string field maxLength is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'string',
          }),
          maxLength: '5',
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root string field maxLength must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number field min is greater than max', (done) => {
      requestPayload.fields = [
        generateBlueprintField({
          type: 'number',
          options: { min: 5, max: 3 },
        }),
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root number field max cannot be less than field min',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number field min is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'number',
          }),
          min: '5',
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root number field min must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number field max is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'number',
          }),
          max: '5',
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root number field max must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number field isInteger is not a boolean', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'number' }), isInteger: 'yes' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root number field isInteger must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field minLength is greater than maxLength', (done) => {
      requestPayload.fields = [
        generateBlueprintField({
          type: 'array',
          options: { minLength: 5, maxLength: 3 },
        }),
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field maxLength cannot be less than field minLength',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field minLength is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'array',
          }),
          minLength: false,
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field minLength must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field maxLength is not a number', (done) => {
      requestPayload.fields = [
        {
          ...generateBlueprintField({
            type: 'array',
          }),
          maxLength: {},
        },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field maxLength must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field arrayOf is missing', (done) => {
      requestPayload.fields = [generateBlueprintField({ type: 'array' })];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field arrayOf must be a field object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field arrayOf is an array', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'array' }), arrayOf: [] },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field arrayOf must be a field object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array field arrayOf is not an object', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'array' }), arrayOf: 'strings, lol' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root array field arrayOf must be a field object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when object field fields is missing', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'object' }), fields: undefined },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root object field fields must be an array of blueprint field objects',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when object field fields is not an array', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'object' }), fields: '' },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root object field fields must be an array of blueprint field objects',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when object field fields is an empty array', (done) => {
      requestPayload.fields = [
        { ...generateBlueprintField({ type: 'object' }), fields: [] },
      ];
      request
        .patch(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'root object field fields must be an array of blueprint field objects',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully update a blueprint', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, blueprint } = res.body;
          expect(message).toBe('blueprint has been successfully updated');
          expect(blueprint.name).toBe(requestPayload.name);
          expect(blueprint.fields).toMatchObject(generatedBlueprintFields);

          const blueprintDbResult = await testProject.getBlueprint({
            where: { id: blueprint.id, isActive: true },
          });

          if (!blueprintDbResult) {
            return done('database does not have entry for blueprint and/or version');
          }

          expect(blueprintDbResult.id).toBe(blueprint.id);
          expect(blueprintDbResult.name).toBe(blueprint.name);
          expect(blueprintDbResult.fields).toMatchObject(generatedBlueprintFields);
          expect(blueprint.createdOn).toBe(blueprintDbResult.createdOn.toISOString());
          expect(blueprint.createdBy).toEqual({
            username: writerUser.username,
            displayName: writerUser.displayName,
            createdOn: writerUser.createdOn.toISOString(),
          });
          expect(blueprint.project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(blueprint.updatedOn).toBe(blueprintDbResult.updatedOn?.toISOString());
          expect(blueprint.updatedBy).toEqual({
            username: adminUser.username,
            displayName: adminUser.displayName,
            createdOn: adminUser.createdOn.toISOString(),
          });

          const versions = await blueprintDbResult.getVersions();
          expect(versions.length).toBe(1);
          const pastVersion = versions[0];
          expect(pastVersion.id).toBeTruthy();
          expect(pastVersion.createdOn).toBeTruthy();
          expect(pastVersion.createdById).toBe(adminUser.id);
          expect(pastVersion.name).toBe(testBlueprint.name); // testBlueprint.name is the original name.
          expect(pastVersion.fields).toEqual(testBlueprint.fields); // testBlueprint.fields are the original fields.
          done();
        });
    });
  });
});
