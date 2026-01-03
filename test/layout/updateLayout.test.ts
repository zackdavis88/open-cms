import { Component, ERROR_TYPES, Layout, Project, TestHelper, User } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/layouts');
const request = testHelper.request;

describe('Update Layout', () => {
  describe(`PATCH ${apiRoute}`, () => {
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
    let testLayout: Layout;
    let deletedLayout: Layout;
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
        name: 'Component1',
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
        name: 'Component2',
      });

      testComponent3 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content3',
          someBooleanField: true,
        },
        name: 'Component3',
      });
      testComponent4 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content4',
          styles: [{ property: 'border', value: '1px solid black' }],
        },
        name: 'Component4',
      });

      testComponent5 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
        content: {
          thisIs: 'content5',
          powerLevel: 9001,
        },
        name: 'Component5',
      });

      testLayout = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        layoutComponents: [
          testComponent3,
          testComponent1,
          testComponent4,
          testComponent2,
          testComponent5,
          testComponent4,
          testComponent3,
          testComponent1,
        ],
      });

      deletedLayout = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        layoutComponents: [],
        isActive: false,
      });
    });

    beforeEach(() => {
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/layouts/${testLayout.id}`,
      );
      requestPayload = {
        name: 'UpdatedTestLayout',
        layoutComponents: [
          testComponent1.id,
          testComponent2.id,
          testComponent3.id,
          testComponent5.id,
        ],
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
        .patch(testHelper.apiRoute(`/projects/SomethingWrong/layouts/${testLayout.id}`))
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
            `/projects/${crypto.randomUUID()}/layouts/${testLayout.id}`,
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
          testHelper.apiRoute(`/projects/${deletedProject.id}/layouts/${testLayout.id}`),
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
      request.patch(apiRoute).set('authorization', readAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject when layout id is not a valid uuid', (done) => {
      request
        .patch(testHelper.apiRoute(`/projects/${testProject.id}/layouts/Nope`))
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested layout id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when layout is not found', (done) => {
      request
        .patch(
          testHelper.apiRoute(
            `/projects/${testProject.id}/layouts/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested layout not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when layout is deleted', (done) => {
      request
        .patch(
          testHelper.apiRoute(`/projects/${testProject.id}/layouts/${deletedLayout.id}`),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested layout not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when there is nothing to update', (done) => {
      request
        .patch(
          testHelper.apiRoute(`/projects/${testProject.id}/layouts/${testLayout.id}`),
        )
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'input contains nothing to update',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when name is not a string', (done) => {
      requestPayload.name = false;
      request
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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
        .patch(apiRoute)
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

    it('should successfully update a layout', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, layout } = res.body;

          const expectedLayoutComponentOrder = [
            testComponent1,
            testComponent2,
            testComponent3,
            testComponent5,
          ];
          await testLayout.reload();

          expect(message).toBe('layout has been successfully updated');
          expect(layout).toEqual({
            id: testLayout.id,
            name: requestPayload.name,
            createdOn: testLayout.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            updatedOn: testLayout.updatedOn?.toISOString() || null,
            updatedBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
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
