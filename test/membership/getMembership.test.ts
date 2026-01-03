import { TestHelper, ERROR_TYPES, User, Project, Membership } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/memberships/:membershipId');
const request = testHelper.request;

describe('Get Membership', () => {
  describe(`GET ${apiRoute}`, () => {
    let testProject: Project;
    let deletedProject: Project;
    let testUser: User;
    let authToken: string;
    let projectOwner: User;
    let membershipMember: User;
    let testMembership: Membership;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      authToken = testHelper.generateAuthToken(testUser);
      deletedProject = await testHelper.createTestProject({
        user: testUser,
        isActive: false,
      });
      projectOwner = await testHelper.createTestUser();
      testProject = await testHelper.createTestProject({ user: projectOwner });
      membershipMember = await testHelper.createTestUser();
      testMembership = await testHelper.createTestMembership({
        user: membershipMember,
        isAdmin: true,
        createdBy: projectOwner,
        project: testProject,
      });
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
        .get(
          testHelper.apiRoute(
            `/projects/SomethingWrong/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', authToken)
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
            `/projects/${crypto.randomUUID()}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', authToken)
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
          testHelper.apiRoute(
            `/projects/${deletedProject.id}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', authToken)
        .expect(
          404,
          {
            error: 'requested project not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when membership id is not a valid uuid', (done) => {
      request
        .get(testHelper.apiRoute(`/projects/${testProject.id}/memberships/NotAUUID`))
        .set('authorization', authToken)
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
        .get(
          testHelper.apiRoute(
            `/projects/${testProject.id}/memberships/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', authToken)
        .expect(
          404,
          {
            error: 'requested membership not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should return membership details', (done) => {
      request
        .get(apiRoute)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, membership } = res.body;
          expect(message).toBe('membership has been successfully retrieved');
          expect(membership).toEqual({
            id: testMembership.id,
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            user: {
              username: membershipMember.username,
              displayName: membershipMember.displayName,
              createdOn: membershipMember.createdOn.toISOString(),
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
