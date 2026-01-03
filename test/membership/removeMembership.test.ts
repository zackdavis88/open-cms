import { TestHelper, ERROR_TYPES, User, Project, Membership } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/memberships/:membershipId');
const request = testHelper.request;

describe('Delete Membership', () => {
  describe(`DELETE ${apiRoute}`, () => {
    let testProject: Project;
    let deletedProject: Project;
    let testUser: User;
    let nonMemberAuthToken: string;
    let writeAuthToken: string;
    let adminAuthToken: string;
    let projectOwner: User;
    let adminUser: User;
    let testMembership: Membership;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      deletedProject = await testHelper.createTestProject({
        user: testUser,
        isActive: false,
      });
      projectOwner = await testHelper.createTestUser();
      testProject = await testHelper.createTestProject({ user: projectOwner });
      adminUser = await testHelper.createTestUser();
      testMembership = await testHelper.createTestMembership({
        user: adminUser,
        isAdmin: true,
        createdBy: projectOwner,
        project: testProject,
      });

      const writeUser = await testHelper.createTestUser();
      await testHelper.createTestMembership({
        project: testProject,
        user: writeUser,
        isWriter: true,
        createdBy: adminUser,
      });
      writeAuthToken = testHelper.generateAuthToken(writeUser);
      adminAuthToken = testHelper.generateAuthToken(adminUser);
    });

    beforeEach(() => {
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/memberships/${testMembership.id}`,
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
          testHelper.apiRoute(
            `/projects/SomethingWrong/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', nonMemberAuthToken)
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
            `/projects/${crypto.randomUUID()}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', nonMemberAuthToken)
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
            `/projects/${deletedProject.id}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', nonMemberAuthToken)
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

    it('should reject requests when the user does not have admin permissions', (done) => {
      request.delete(apiRoute).set('authorization', writeAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject when membership id is not a valid uuid', (done) => {
      request
        .delete(testHelper.apiRoute(`/projects/${testProject.id}/memberships/NotAUUID`))
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested membership id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when membership is not found', (done) => {
      request
        .delete(
          testHelper.apiRoute(
            `/projects/${testProject.id}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested membership not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when confirm is missing', (done) => {
      request.delete(apiRoute).set('authorization', adminAuthToken).expect(
        422,
        {
          error: 'confirm is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when confirm is not a string', (done) => {
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

    it('should reject requests when confirm is not the displayName of the membership user', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: 'please work!' })
        .expect(
          422,
          {
            error: `confirm must match the membership displayName: ${adminUser.displayName}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully remove a membership', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ confirm: adminUser.displayName })
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully removed');
          expect(membership).toEqual({
            id: testMembership.id,
            user: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            createdOn: testMembership.createdOn.toISOString(),
            createdBy: {
              username: projectOwner.username,
              displayName: projectOwner.displayName,
              createdOn: projectOwner.createdOn.toISOString(),
            },
            updatedOn: null,
            updatedBy: null,
            isAdmin: testMembership.isAdmin,
            isWriter: testMembership.isWriter,
          });
          done();
        });
    });
  });
});
