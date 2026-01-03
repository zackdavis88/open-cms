import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  generateBlueprintField,
  Blueprint,
  Component,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/components/:componentId');
const request = testHelper.request;

describe('Update Component', () => {
  describe(`PATCH ${apiRoute}`, () => {
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
    let stringComponent: Component;
    let numberComponent: Component;
    let integerComponent: Component;
    let booleanComponent: Component;
    let dateComponent: Component;
    let arrayComponent: Component;
    let objectComponent: Component;
    let testComponent: Component;
    let deletedComponent: Component;
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
      });

      testComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });

      deletedComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
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
      stringComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: stringBlueprint,
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
      numberComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: numberBlueprint,
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
      integerComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: integerBlueprint,
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
      booleanComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: booleanBlueprint,
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
      dateComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: dateBlueprint,
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
      arrayComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: arrayBlueprint,
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
      objectComponent = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: objectBlueprint,
      });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/components/${testComponent.id}`,
      );
      requestPayload = {
        name: 'UpdatedComponent',
        content: { defaultObjectField: {} },
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
          testHelper.apiRoute(`/projects/SomethingWrong/components/${testComponent.id}`),
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
            `/projects/${crypto.randomUUID()}/components/${testComponent.id}`,
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
            `/projects/${deletedProject.id}/components/${testComponent.id}`,
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

    it('should reject when component id is not a valid uuid', (done) => {
      request
        .patch(testHelper.apiRoute(`/projects/${testProject.id}/components/Wrong`))
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested component id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when component is not found', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested component not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when component is deleted', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${deletedComponent.id}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested component not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when there is no input', (done) => {
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
      requestPayload.name = 123;
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

    it('should reject requests when content is not an object of key/values', (done) => {
      requestPayload.content = 'this is invalid';
      request
        .patch(apiRoute)
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
      requestPayload.content = { defaultObjectField: null };
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${testComponent.id}`,
          ),
        )
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'defaultObjectField value must be an object',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when string content value is not a string', (done) => {
      requestPayload.content = { stringField: 1 };
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${stringComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${numberComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${integerComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${booleanComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${dateComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${dateComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${arrayComponent.id}`,
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
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${objectComponent.id}`,
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

    it('should successfully update a component', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/components/${testComponent.id}`,
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
          // Make sure a new version was created, do this before reload()
          const versions = await testComponent.getVersions();
          expect(versions.length).toBe(1);
          const pastVersion = versions[0];
          expect(pastVersion.id).toBeTruthy();
          expect(pastVersion.createdOn).toBeTruthy();
          expect(pastVersion.createdById).toBe(writerUser.id);
          expect(pastVersion.name).toBe(testComponent.name); // testComponent.name is the original name.
          expect(pastVersion.content).toEqual(testComponent.content); // testComponent.content is the original content.

          await testComponent.reload();

          expect(message).toBe('component has been successfully updated');
          expect(component).toEqual({
            id: testComponent.id,
            name: requestPayload.name,
            createdOn: testComponent.createdOn.toISOString(),
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
            updatedOn: testComponent.updatedOn?.toISOString(),
            updatedBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
            content: requestPayload.content,
            blueprintVersion: null,
          });

          done();
        });
    });
  });
});
