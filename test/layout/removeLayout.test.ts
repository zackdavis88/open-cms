import { TestHelper, ERROR_TYPES, User, Project, Component, Layout } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/layouts/:layoutId');
const request = testHelper.request;

describe('Remove Layout', () => {
  describe(`DELETE ${apiRoute}`, () => {
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
    let writeAuthToken: string;
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
      writeAuthToken = testHelper.generateAuthToken(writerUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/layouts/${testLayout.id}`,
      );
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.delete(apiRoute).expect(
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
        .delete(testHelper.apiRoute(`/projects/SomethingWrong/layouts/${testLayout.id}`))
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
        .delete(
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
        .delete(
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
      request.delete(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have write permissions', (done) => {
      request.delete(apiRoute).set('authorization', readerAuthToken).expect(
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
        .delete(testHelper.apiRoute(`/projects/${testProject.id}/layouts/Wrong`))
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
        .delete(
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
        .delete(
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

    it('should reject when confirm is missing', (done) => {
      request.delete(apiRoute).set('authorization', writeAuthToken).expect(
        422,
        {
          error: 'confirm is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject when confirm is not a string', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: 123 })
        .expect(
          422,
          {
            error: 'confirm must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when confirm does not match layout name', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', writeAuthToken)
        .send({ confirm: 'NotRight' })
        .expect(
          422,
          {
            error: `confirm must match the layout name: ${testLayout.name}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully remove layout details', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: testLayout.name })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          const { message, layout } = res.body;
          await testLayout.reload();
          expect(message).toBe('layout has been successfully removed');
          expect(layout).toEqual({
            id: testLayout.id,
            name: testLayout.name,
            createdOn: testLayout.createdOn.toISOString(),
            updatedOn: testLayout.updatedOn?.toISOString() || null,
            deletedOn: testLayout.deletedOn?.toISOString(),
            deletedBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
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
            layoutComponents: testLayout.layoutComponents.map((_, index) => {
              return {
                id: layoutOrder[index].id,
                name: layoutOrder[index].name,
                content: layoutOrder[index].content,
              };
            }),
          });

          expect(testLayout.isActive).toBe(false);
          done();
        });
    });
  });
});
