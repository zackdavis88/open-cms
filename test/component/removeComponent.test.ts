import { TestHelper, ERROR_TYPES, User, Project, Blueprint, Component } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/components/:componentId');
const request = testHelper.request;

describe('Remove Component', () => {
  describe(`DELETE ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let testBlueprint: Blueprint;
    let testComponent: Component;
    let deletedComponent: Component;
    let adminAuthToken: string;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;

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
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/components/${testComponent.id}`,
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
        .delete(
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
        .delete(
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
        .delete(
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
      request.delete(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have write access', (done) => {
      request.delete(apiRoute).set('authorization', readerAuthToken).expect(
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
        .delete(testHelper.apiRoute(`/projects/${testProject.id}/components/Wrong`))
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
        .delete(
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
        .delete(
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

    it('should reject when confirm is missing', (done) => {
      request.delete(apiRoute).set('authorization', adminAuthToken).expect(
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
        .send({ confirm: true })
        .expect(
          422,
          {
            error: 'confirm must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when confirm does not match component name', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: 'NotTheName' })
        .expect(
          422,
          {
            error: `confirm must match the component name: ${testComponent.name}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully delete a component', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: testComponent.name })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, component } = res.body;
          expect(message).toBe('component has been successfully removed');
          expect(component).toMatchObject({
            id: testComponent.id,
            name: testComponent.name,
            content: testComponent.content,
            createdOn: testComponent.createdOn.toISOString(),
            createdBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
            updatedOn: testComponent.updatedOn?.toISOString() || null,
            updatedBy: null,
            blueprint: {
              id: testBlueprint.id,
              name: testBlueprint.name,
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
          });

          await testComponent.reload();
          expect(testComponent.isActive).toBe(false);
          expect(component.deletedOn).toBe(testComponent.deletedOn?.toISOString());
          expect(component.deletedBy).toEqual({
            username: adminUser.username,
            displayName: adminUser.displayName,
            createdOn: adminUser.createdOn.toISOString(),
          });
          done();
        });
    });
  });
});
