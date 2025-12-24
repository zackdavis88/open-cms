import { TestHelper, ERROR_TYPES, User, Project, Membership } from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId/memberships/:membershipId';
const request = testHelper.request;

describe('Update Membership', () => {
  describe(`PATCH ${apiRoute}`, () => {
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
      apiRoute = `/api/projects/${testProject.id}/memberships/${testMembership.id}`;
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.patch(apiRoute).expect(
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
        .patch(`/api/projects/SomethingWrong/memberships/${testHelper.generateUUID()}`)
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
        .patch(
          `/api/projects/${testHelper.generateUUID()}/memberships/${testHelper.generateUUID()}`,
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
        .patch(
          `/api/projects/${deletedProject.id}/memberships/${testHelper.generateUUID()}`,
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
      request.patch(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have admin permissions', (done) => {
      request.patch(apiRoute).set('authorization', writeAuthToken).expect(
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
        .patch(`/api/projects/${testProject.id}/memberships/NotAUUID`)
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
        .patch(`/api/projects/${testProject.id}/memberships/${testHelper.generateUUID()}`)
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

    it('should reject when there is no valid input', (done) => {
      request.patch(apiRoute).set('authorization', adminAuthToken).send({}).expect(
        422,
        {
          error: 'input contains nothing to update',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject when isAdmin is not a boolean', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isAdmin: 'yes', isWriter: false })
        .expect(
          422,
          {
            error: 'isAdmin must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when isWriter is not a boolean', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isAdmin: false, isWriter: 1 })
        .expect(
          422,
          {
            error: 'isWriter must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully update a membership', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isAdmin: false, isWriter: false })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }
          await testMembership.reload();

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully updated');
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
            createdBy: {
              username: projectOwner.username,
              displayName: projectOwner.displayName,
              createdOn: projectOwner.createdOn.toISOString(),
            },
            updatedOn: testMembership.updatedOn?.toISOString() || null,
            createdOn: testMembership.createdOn.toISOString(),
            updatedBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            isAdmin: false,
            isWriter: false,
          });
          done();
        });
    });
  });
});
