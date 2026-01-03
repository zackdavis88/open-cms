import { TestHelper, ERROR_TYPES, User, Project } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/memberships/:username');
const request = testHelper.request;

describe('Create Membership', () => {
  describe(`POST ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let deletedUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let adminAuthToken: string;
    let writerAuthToken: string;
    let nonMemberAuthToken: string;
    let requestPayload: {
      isAdmin?: unknown;
      isWriter?: unknown;
    };

    beforeAll(async () => {
      adminUser = await testHelper.createTestUser();
      writerUser = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();
      deletedUser = await testHelper.createTestUser({
        isActive: false,
      });
      deletedProject = await testHelper.createTestProject({
        isActive: false,
        user: adminUser,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testProject.createMembership({ userId: writerUser.id, isWriter: true });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/memberships/${testUser.displayName}`,
      );
      requestPayload = {
        isAdmin: true,
        isWriter: false,
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
        .post(testHelper.apiRoute('/projects/SomethingWrong/memberships/someUsername'))
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
            `/projects/${crypto.randomUUID()}/memberships/someUsername`,
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
          testHelper.apiRoute(`/projects/${deletedProject.id}/memberships/someUsername`),
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

    it('should reject requests when the user does not have admin permissions', (done) => {
      request.post(apiRoute).set('authorization', writerAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the requested user does not exist', (done) => {
      request
        .post(testHelper.apiRoute(`/projects/${testProject.id}/memberships/DoesNotExi$t`))
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested user not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when the requested user is deleted', (done) => {
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/memberships/${deletedUser.displayName}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested user not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when the requested user is already a member', (done) => {
      request
        .post(
          testHelper.apiRoute(
            `/projects/${testProject.id}/memberships/${writerUser.displayName}`,
          ),
        )
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'membership already exists for this user',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when isAdmin is present and not a boolean', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isAdmin: 'yep' })
        .expect(
          422,
          {
            error: 'isAdmin must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when isWriter is present and not a boolean', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isWriter: 1 })
        .expect(
          422,
          {
            error: 'isWriter must be a boolean',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully create a read-only membership', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          // Pull the new membership from the database
          const newMembership = await testProject.getMembership({
            where: { userId: testUser.id },
          });
          if (!newMembership) {
            return done('membership not found in database');
          }

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully created');
          expect(membership).toEqual({
            id: newMembership.id,
            user: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            createdOn: newMembership.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            isAdmin: false,
            isWriter: false,
          });
          expect(newMembership.isAdmin).toBe(false);
          expect(newMembership.isWriter).toBe(false);

          // Delete the newly created membership so that downstream tests in this file pass.
          await newMembership.destroy();
          done();
        });
    });

    it('should successfully create an admin membership', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          // Pull the new membership from the database
          const newMembership = await testProject.getMembership({
            where: { userId: testUser.id },
          });
          if (!newMembership) {
            return done('membership not found in database');
          }

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully created');
          expect(membership).toEqual({
            id: newMembership.id,
            user: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            createdOn: newMembership.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            isAdmin: true,
            isWriter: false,
          });
          expect(newMembership.isAdmin).toBe(true);
          expect(newMembership.isWriter).toBe(false);

          await newMembership.destroy();
          done();
        });
    });

    it('should successfully create a write membership', (done) => {
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .send({ isWriter: true })
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          // Pull the new membership from the database
          const newMembership = await testProject.getMembership({
            where: { userId: testUser.id },
          });
          if (!newMembership) {
            return done('membership not found in database');
          }

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully created');
          expect(membership).toEqual({
            id: newMembership.id,
            user: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            createdOn: newMembership.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            isAdmin: false,
            isWriter: true,
          });
          expect(newMembership.isAdmin).toBe(false);
          expect(newMembership.isWriter).toBe(true);

          done();
        });
    });
  });
});
