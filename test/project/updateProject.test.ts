import { TestHelper, ERROR_TYPES, User, Project } from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId';
const request = testHelper.request;

describe('Update Project', () => {
  describe(`PATCH ${apiRoute}`, () => {
    let testUser: User;
    let adminAuthToken: string;
    let writeAuthToken: string;
    let nonMemberAuthToken: string;
    let deletedProject: Project;
    let testProject: Project;
    let requestPayload: {
      name?: unknown;
      description?: unknown;
    };

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      const nonMember = await testHelper.createTestUser();
      const writeMember = await testHelper.createTestUser();
      deletedProject = await testHelper.createTestProject({
        user: testUser,
        isActive: false,
      });

      testProject = await testHelper.createTestProject({ user: testUser });
      await testProject.createMembership({
        userId: writeMember.id,
        createdById: testUser.id,
        isWriter: true,
      });
      adminAuthToken = testHelper.generateAuthToken(testUser);
      nonMemberAuthToken = testHelper.generateAuthToken(nonMember);
      writeAuthToken = testHelper.generateAuthToken(writeMember);
    });

    beforeEach(() => {
      requestPayload = {
        name: 'UpdateTestProject',
        description: 'Testing project update',
      };
      apiRoute = `/api/projects/${testProject.id}`;
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

    it('should reject requests when the project id is not valid', (done) => {
      request
        .patch('/api/projects/ImpossibleId')
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

    it('should reject requests when the project is deleted', (done) => {
      request
        .patch(`/api/projects/${deletedProject.id}`)
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

    it('should reject requests when the project does not exist', (done) => {
      request
        .patch(`/api/projects/${testHelper.generateUUID()}`)
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

    it('should reject requests when the payload contains nothing to update', (done) => {
      request.patch(apiRoute).set('authorization', adminAuthToken).send({}).expect(
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

    it('should reject requests when description is not a string', (done) => {
      requestPayload.description = {};
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'description must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when description is more than 350 characters', (done) => {
      requestPayload.description = Array(351).fill('a').join('');
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'description must be 350 characters or less',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully update a project', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          await testProject.reload();
          const { message, project } = res.body;
          expect(message).toBe('project has been successfully updated');
          expect(project.createdBy).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
          });
          expect(project).toEqual({
            id: testProject.id,
            name: requestPayload.name,
            description: requestPayload.description,
            createdOn: testProject.createdOn.toISOString(),
            updatedOn: testProject.updatedOn?.toISOString() || null,
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
          });
          done();
        });
    });
  });
});
