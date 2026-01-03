import { TestHelper, ERROR_TYPES, User, Project, Component, Layout } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/layouts/:layoutId');
const request = testHelper.request;

describe('Get Layout', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let testLayout: Layout;
    let deletedLayout: Layout;
    let testComponent1: Component;
    let testComponent2: Component;
    let testComponent3: Component;
    let testComponent4: Component;
    let testComponent5: Component;
    let adminAuthToken: string;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let layoutOrder: Component[];

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

      const testBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writerUser,
      });

      testComponent1 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });
      testComponent2 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });
      testComponent3 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });
      testComponent4 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });
      testComponent5 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writerUser,
        blueprint: testBlueprint,
      });

      deletedLayout = await testHelper.createTestLayout({
        project: testProject,
        createdBy: writerUser,
        isActive: false,
        layoutComponents: [],
      });

      layoutOrder = [
        testComponent5,
        testComponent3,
        testComponent2,
        testComponent4,
        testComponent1,
      ];
      testLayout = await testHelper.createTestLayout({
        project: testProject,
        createdBy: writerUser,
        layoutComponents: layoutOrder,
      });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/layouts/${testLayout.id}`,
      );
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.get(apiRoute).expect(
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
        .get(testHelper.apiRoute(`/projects/SomethingWrong/layouts/${testLayout.id}`))
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
        .get(
          testHelper.apiRoute(
            `/projects/${testHelper.generateUUID()}/layouts/${testLayout.id}`,
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
        .get(
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
      request.get(apiRoute).set('authorization', nonMemberAuthToken).expect(
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
        .get(testHelper.apiRoute(`/projects/${testProject.id}/layouts/Wrong`))
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
        .get(
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
        .get(
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

    it('should successfully retrieve layout details', (done) => {
      request
        .get(apiRoute)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          const { message, layout } = res.body;

          expect(message).toBe('layout has been successfully retrieved');
          expect(layout).toEqual({
            id: testLayout.id,
            name: testLayout.name,
            createdOn: testLayout.createdOn.toISOString(),
            updatedOn: testLayout.updatedOn?.toISOString() || null,
            createdBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
            updatedBy:
              (testLayout.updatedBy && {
                username: writerUser.username,
                displayName: writerUser.displayName,
                createdOn: writerUser.createdOn.toISOString(),
              }) ||
              null,
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            // This is crucial. LayoutComponents MUST be returned in expected order or else
            // the concept of a Layout is useless.
            layoutComponents: testLayout.layoutComponents.map((_, index) => {
              return {
                id: layoutOrder[index].id,
                name: layoutOrder[index].name,
                content: layoutOrder[index].content,
              };
            }),
          });
          done();
        });
    });
  });
});
