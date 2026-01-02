import { TestHelper, ERROR_TYPES, User, Project, Blueprint } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/blueprints/:blueprintId');
const request = testHelper.request;

describe('Get Blueprint', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let testBlueprint: Blueprint;
    let deletedBlueprint: Blueprint;

    beforeAll(async () => {
      adminUser = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();
      readUser = await testHelper.createTestUser();
      deletedProject = await testHelper.createTestProject({
        isActive: false,
        user: adminUser,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testHelper.createTestMembership({
        project: testProject,
        user: readUser,
        createdBy: adminUser,
      });

      testBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        updatedBy: adminUser,
      });

      deletedBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        isActive: false,
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/blueprints/${testBlueprint.id}`,
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
            `/projects/SomethingWrong/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', readerAuthToken)
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
            `/projects/${crypto.randomUUID()}/blueprints/${crypto.randomUUID()}`,
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
        .get(
          testHelper.apiRoute(
            `/projects/${deletedProject.id}/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', readerAuthToken)
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

    it('should reject when blueprint id is not a valid uuid', (done) => {
      request
        .get(testHelper.apiRoute(`/projects/${testProject.id}/blueprints/wrong`))
        .set('authorization', readerAuthToken)
        .expect(
          422,
          {
            error: 'requested blueprint id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when blueprint is deleted', (done) => {
      request
        .get(
          testHelper.apiRoute(
            `/projects/${testProject.id}/blueprints/${deletedBlueprint.id}`,
          ),
        )
        .set('authorization', readerAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when blueprint is not found', (done) => {
      request
        .get(
          testHelper.apiRoute(
            `/projects/${testProject.id}/blueprints/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', readerAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should successfully retrieve blueprint details', (done) => {
      request
        .get(apiRoute)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, blueprint } = res.body;
          expect(message).toBe('blueprint has been successfully retrieved');
          expect(blueprint).toEqual({
            id: testBlueprint.id,
            name: testBlueprint.name,
            fields: testBlueprint.fields,
            createdOn: testBlueprint.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            updatedOn: testBlueprint.updatedOn?.toISOString() || null,
            updatedBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
          });
          done();
        });
    });
  });
});
