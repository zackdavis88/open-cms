import { Component, ERROR_TYPES, Project, TestHelper, User } from '../utils';

const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/layouts');
const request = testHelper.request;

describe('Create Layout', () => {
  describe(`POST ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let nonMemberUser: User;
    let adminAuthToken: string;
    let readAuthToken: string;
    let nonMemberAuthToken: string;
    let testProject: Project;
    let deletedProject: Project;
    let testComponent1: Component;
    let testComponent2: Component;
    let testComponent3: Component;
    let testComponent4: Component;
    let testComponent5: Component;
    let requestPayload: {
      name?: unknown;
      layoutComponents?: unknown;
    };

    beforeAll(async () => {
      adminUser = await testHelper.createTestUser();
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      readUser = await testHelper.createTestUser();
      readAuthToken = testHelper.generateAuthToken(readUser);
      nonMemberUser = await testHelper.createTestUser();
      nonMemberAuthToken = testHelper.generateAuthToken(nonMemberUser);
      deletedProject = await testHelper.createTestProject({
        user: adminUser,
        isActive: false,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testHelper.createTestMembership({
        project: testProject,
        user: readUser,
        createdBy: adminUser,
      });

      const testBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
      });

      testComponent1 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content1',
          itsCool: true,
          reasonsWhyItsCool: ['fuck you, thats why.'],
        },
      });

      testComponent2 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content2',
          itsCool: false,
          reasonsWhyItsCool: ['its not'],
        },
      });

      testComponent3 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content3',
          someBooleanField: true,
        },
      });
      testComponent4 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content4',
          styles: [{ property: 'border', value: '1px solid black' }],
        },
      });

      testComponent5 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content5',
          powerLevel: 9001,
        },
      });
    });

    beforeEach(() => {
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/layouts`);
      requestPayload = {
        name: 'MyTestLayout',
        layoutComponents: [
          testComponent3.id,
          testComponent1.id,
          testComponent4.id,
          testComponent2.id,
          testComponent5.id,
          testComponent4.id,
          testComponent3.id,
          testComponent1.id,
        ],
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
        .post(testHelper.apiRoute('/projects/SomethingWrong/layouts'))
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
        .post(testHelper.apiRoute(`/projects/${testHelper.generateUUID()}/layouts`))
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
        .post(testHelper.apiRoute(`/projects/${deletedProject.id}/layouts`))
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
      request.post(apiRoute).set('authorization', readAuthToken).expect(
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
        .set('authorization', adminAuthToken)
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
        .set('authorization', adminAuthToken)
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
        .set('authorization', adminAuthToken)
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
        .set('authorization', adminAuthToken)
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
        .set('authorization', adminAuthToken)
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

    it('should reject requests when layoutComponents is not an array', (done) => {
      requestPayload.layoutComponents = 'b4ad55e5-af42-4e2f-9638-9dc1243fb4fb';
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'layoutComponents must be an array of componentIds',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when layoutComponents is an empty array', (done) => {
      requestPayload.layoutComponents = [];
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'layoutComponents must be an array of componentIds',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when layoutComponents contains a non-string item', (done) => {
      requestPayload.layoutComponents = [{}];
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'layoutComponents must be strings of componentIds',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when layoutComponents contains an invalid uuid', (done) => {
      requestPayload.layoutComponents = ['notAUUID'];
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'requested layoutComponent id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when layoutComponents contains a component that doesnt exist', (done) => {
      requestPayload.layoutComponents = [testComponent1.id, crypto.randomUUID()];
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'one or more layoutComponents was not found',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully create a layout', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, layout } = res.body;
          const dbLayout = await testProject.getLayout({ where: { id: layout.id } });
          if (!dbLayout) {
            return done('layout not found in database');
          }

          const expectedLayoutComponentOrder = [
            testComponent3,
            testComponent1,
            testComponent4,
            testComponent2,
            testComponent5,
            testComponent4,
            testComponent3,
            testComponent1,
          ];

          expect(message).toBe('layout has been successfully created');
          expect(layout).toEqual({
            id: dbLayout.id,
            name: requestPayload.name,
            createdOn: dbLayout.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            layoutComponents: expectedLayoutComponentOrder.map((component) => ({
              id: component.id,
              name: component.name,
              content: component.content,
            })),
          });
          done();
        });
    });
  });
});
