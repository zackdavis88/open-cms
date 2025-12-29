import { TestHelper, ERROR_TYPES, User, Project, generateBlueprintField } from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId/blueprints';
const request = testHelper.request;

const generatedBlueprintFields = [
  generateBlueprintField({
    type: 'string',
    options: { name: 'rootString1', regex: '^test_regex' },
  }),
  generateBlueprintField({ type: 'date', options: { name: 'rootDate1' } }),
  generateBlueprintField({
    type: 'number',
    options: { name: 'rootNumber1', isInteger: true, max: 100, min: 0, isRequired: true },
  }),
  generateBlueprintField({ type: 'boolean', options: { name: 'rootBoolean1' } }),
  generateBlueprintField({
    type: 'array',
    options: {
      name: 'rootArray1',
      arrayOf: generateBlueprintField({ type: 'string' }),
      minLength: 1,
      maxLength: 9,
    },
  }),
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

describe('Create Blueprint', () => {
  describe(`POST ${apiRoute}`, () => {
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
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = `/api/projects/${testProject.id}/blueprints`;
      requestPayload = {
        name: 'Unit Test Blueprint',
        fields: generatedBlueprintFields,
      };
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.post(apiRoute).send(requestPayload).expect(
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
        .post('/api/projects/SomethingWrong/blueprints')
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
        .post(`/api/projects/${testHelper.generateUUID()}/blueprints`)
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
        .post(`/api/projects/${deletedProject.id}/blueprints`)
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
      request.post(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have write permissions', (done) => {
      request.post(apiRoute).set('authorization', readerAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when name is missing', (done) => {
      requestPayload.name = undefined;
      request
        .post(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'name is missing from input',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when name is not a string', (done) => {
      requestPayload.name = false;
      request
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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

    it('should reject requests when fields is missing', (done) => {
      requestPayload.fields = undefined;
      request
        .post(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'fields is missing from input',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when fields is not an array of objects', (done) => {
      requestPayload.fields = {};
      request
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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

    it('should reject requests when string field minLength is greater than maxLength', (done) => {
      requestPayload.fields = [
        generateBlueprintField({
          type: 'string',
          options: { minLength: 5, maxLength: 3 },
        }),
      ];
      request
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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
        .post(apiRoute)
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

    it('should successfully create a new blueprint', (done) => {
      request
        .post(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, blueprint } = res.body;
          expect(message).toBe('blueprint has been successfully created');
          expect(blueprint.name).toBe(requestPayload.name);
          expect(blueprint.fields).toMatchObject(generatedBlueprintFields);

          // Ensure the blueprint exists in the db.
          const blueprintDbResult = await testProject.getBlueprint({
            where: { id: blueprint.id, isActive: true },
          });

          if (!blueprintDbResult) {
            return done('database does not have entry for blueprint');
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
          done();
        });
    });
  });
});
