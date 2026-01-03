import { TestHelper, ERROR_TYPES, User, Project } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId');
const request = testHelper.request;

describe('Get Project', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let testProject: Project;
    let deletedProject: Project;
    let authToken: string;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      authToken = testHelper.generateAuthToken(testUser);
      testProject = await testHelper.createTestProject({ user: testUser });
      deletedProject = await testHelper.createTestProject({
        user: testUser,
        isActive: false,
      });
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}`);
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
        .get(testHelper.apiRoute('/projects/SomethingWrong'))
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
        .get(testHelper.apiRoute(`/projects/${crypto.randomUUID()}`))
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}`))
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

    it('should return project data', (done) => {
      request
        .get(apiRoute)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, project } = res.body;
          expect(message).toBe('project has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            updatedOn: testProject.updatedOn?.toISOString() || null,
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedBy:
              (project.updatedBy && {
                username: testProject.updatedBy.username,
                displayName: testProject.updatedBy.displayName,
                createdOn: testProject.updatedBy.createdOn.toISOString(),
              }) ||
              null,
          });

          done();
        });
    });
  });
});
