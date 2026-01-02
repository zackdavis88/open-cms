import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  generateBlueprintField,
  Blueprint,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/components/:blueprintId');
const request = testHelper.request;

const generatedBlueprintFields = [
  generateBlueprintField({
    type: 'string',
    options: { name: 'ComponentName', isRequired: true },
  }),
  generateBlueprintField({
    type: 'date',
    options: { name: 'startDate' },
  }),
  generateBlueprintField({
    type: 'date',
    options: { name: 'endDate' },
  }),
  generateBlueprintField({
    type: 'object',
    options: {
      name: 'props',
      fields: [
        generateBlueprintField({
          type: 'string',
          options: { name: 'componentStringProp' },
        }),
        generateBlueprintField({
          type: 'string',
          options: { name: 'componentStringProp2' },
        }),
        generateBlueprintField({
          type: 'boolean',
          options: { name: 'componentBooleanProp' },
        }),
        generateBlueprintField({
          type: 'number',
          options: { name: 'componentNumberProp' },
        }),
        generateBlueprintField({
          type: 'array',
          options: {
            name: 'componentArrayProp',
            minLength: 1,
            arrayOf: generateBlueprintField({
              type: 'string',
              options: { name: 'componentArrayItem' },
            }),
          },
        }),
      ],
    },
  }),
  generateBlueprintField({
    type: 'array',
    options: {
      name: 'styles',
      isRequired: true,
      arrayOf: generateBlueprintField({
        type: 'object',
        options: {
          name: 'styleObject',
          fields: [
            generateBlueprintField({
              type: 'string',
              options: { name: 'property', isRequired: true },
            }),
            generateBlueprintField({
              type: 'string',
              options: { name: 'value', isRequired: true },
            }),
          ],
        },
      }),
    },
  }),
];

describe('Create Component', () => {
  describe(`POST ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let testBlueprint: Blueprint;
    let stringBlueprint: Blueprint;
    let numberBlueprint: Blueprint;
    let integerBlueprint: Blueprint;
    let booleanBlueprint: Blueprint;
    let dateBlueprint: Blueprint;
    let arrayBlueprint: Blueprint;
    let objectBlueprint: Blueprint;
    let deletedBlueprint: Blueprint;
    let adminAuthToken: string;
    let writerAuthToken: string;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let requestPayload: {
      name?: unknown;
      content?: unknown;
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
        fields: generatedBlueprintFields,
      });

      deletedBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        isActive: false,
      });

      stringBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'string',
            options: {
              name: 'stringField',
              regex: '^Test_',
              minLength: 6,
              maxLength: 50,
              isRequired: true,
            },
          }),
        ],
      });

      numberBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'number',
            options: {
              name: 'numberField',
              isRequired: true,
              min: -2,
              max: 500,
            },
          }),
        ],
      });

      integerBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'number',
            options: {
              name: 'integerField',
              isRequired: true,
              isInteger: true,
              min: -40,
              max: 40,
            },
          }),
        ],
      });

      booleanBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'boolean',
            options: {
              name: 'booleanField',
              isRequired: true,
            },
          }),
        ],
      });

      dateBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'date',
            options: {
              name: 'dateField',
              isRequired: true,
            },
          }),
        ],
      });

      arrayBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'array',
            options: {
              name: 'arrayField',
              isRequired: true,
              minLength: 1,
              maxLength: 5,
              arrayOf: generateBlueprintField({
                type: 'string',
                options: { name: 'arrayFieldItem' },
              }),
            },
          }),
        ],
      });

      dateBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'date',
            options: {
              name: 'dateField',
              isRequired: true,
            },
          }),
        ],
      });

      objectBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
        fields: [
          generateBlueprintField({
            type: 'object',
            options: {
              name: 'objectField',
              isRequired: true,
              fields: [],
            },
          }),
        ],
      });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/components/${testBlueprint.id}`,
      );
      requestPayload = {
        name: 'Unit Test Component',
        content: {
          ComponentName: 'MyComponent',
          startDate: '01-01-2026',
          endDate: '04-17-2026',
          props: {
            componentStringProp: 'some string prop value',
            componentStringProp2: 'another one',
            componentBooleanProp: true,
            componentNumberProp: 67,
            componentArrayProp: ['an array value', 'possibly another value?!?'],
          },
          styles: [
            { property: 'borderRadius', value: '1000px' },
            { property: 'width', value: '100%' },
            { property: 'overflowY', value: 'scroll' },
          ],
        },
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
        .post(
          testHelper.apiRoute(`/projects/SomethingWrong/components/${testBlueprint.id}`),
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
        .post(
          testHelper.apiRoute(
            `/projects/${testHelper.generateUUID()}/components/${testBlueprint.id}`,
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
        .post(
          testHelper.apiRoute(
            `/projects/${deletedProject.id}/components/${testBlueprint.id}`,
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

    it('should reject when blueprint id is not a valid uuid', (done) => {
      request
        .post(testHelper.apiRoute(`/projects/${testProject.id}/components/Wrong`))
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
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${crypto.randomUUID()}`,
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
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${deletedBlueprint.id}`,
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

    it('should reject requests when content is missing', (done) => {
      requestPayload.content = undefined;
      request
        .post(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'content is missing from input',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when content is not an object of key/values', (done) => {
      requestPayload.content = 'this is invalid';
      request
        .post(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'content must be an object that matches the blueprint shape',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when a required field is missing', (done) => {
      requestPayload.content = { stringField: undefined };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'stringField value must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string content value is not a string', (done) => {
      requestPayload.content = { stringField: 1 };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'stringField value must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when content string does not match regex', (done) => {
      requestPayload.content = { stringField: 'doesnt_match' };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'stringField value does not match regex: ^Test_',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when content string is under the minLength', (done) => {
      requestPayload.content = { stringField: 'Test_' };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'stringField value has a minLength of 6',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when content string is over the maxLength', (done) => {
      requestPayload.content = {
        stringField: `Test_${new Array(50).fill('a').join('')}`,
      };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'stringField value has a maxLength of 50',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number content value is not a number', (done) => {
      requestPayload.content = { numberField: '1' };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'numberField value must be a number',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number content value is under the min', (done) => {
      requestPayload.content = { numberField: -5 };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'numberField value has a min of -2',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number content value is over the max', (done) => {
      requestPayload.content = { numberField: 501 };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'numberField value has a max of 500',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when number content value is not an integer', (done) => {
      requestPayload.content = { integerField: 5.5 };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${integerBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'integerField value must be an integer',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when boolean content value is not a boolean', (done) => {
      requestPayload.content = { booleanField: 1 };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${booleanBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'booleanField value must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when date content value is not a date', (done) => {
      requestPayload.content = { dateField: true };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${dateBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'dateField value must be a valid date-string or epoch time',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when date content value is not a valid date', (done) => {
      requestPayload.content = { dateField: 'yesterday, lol' };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${dateBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'dateField value must be a valid date',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array content value is not an array', (done) => {
      requestPayload.content = { arrayField: {} };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'arrayField value must be an array',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array content is under the minLength', (done) => {
      requestPayload.content = { arrayField: [] };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'arrayField has a minLength of 1',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array content is over the maxLength', (done) => {
      requestPayload.content = { arrayField: new Array(6).fill('a') };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'arrayField has a maxLength of 5',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when array content does not match arrayOf shape', (done) => {
      requestPayload.content = { arrayField: [{}] };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'arrayFieldItem value must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when object content value is not an object', (done) => {
      requestPayload.content = { objectField: '' };
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${objectBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'objectField value must be an object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully create a component', (done) => {
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${testBlueprint.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          const { message, component } = res.body;

          // Make sure its really saved to the db.
          const dbComponent = await testProject.getComponent({
            where: { id: component.id, isActive: true },
          });
          if (!dbComponent) {
            return done('component not found in database');
          }

          expect(message).toBe('component has been successfully created');
          expect(component).toEqual({
            id: dbComponent.id,
            name: requestPayload.name,
            createdOn: dbComponent.createdOn.toISOString(),
            createdBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            blueprint: {
              id: testBlueprint.id,
              name: testBlueprint.name,
            },
            content: {
              ...(requestPayload.content as Record<string, unknown>),
              startDate: new Date('01-01-2026').toISOString(),
              endDate: new Date('04-17-2026').toISOString(),
            },
          });
          done();
        });
    });
  });
});
