import { TestHelper, ERROR_TYPES, User, Project } from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId';
const request = testHelper.request;

describe('Remove Project', () => {
  describe(`DELETE ${apiRoute}`, () => {
    let testUser: User;
    let adminAuthToken: string;
    let writeAuthToken: string;
    let nonMemberAuthToken: string;
    let deletedProject: Project;
    let testProject: Project;
    let requestPayload: {
      confirm?: unknown;
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
        confirm: testProject.name,
      };
      apiRoute = `/api/projects/${testProject.id}`;
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.delete(apiRoute).send(requestPayload).expect(
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
        .delete('/api/projects/ImpossibleId')
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
        .delete(`/api/projects/${deletedProject.id}`)
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
        .delete(`/api/projects/${testHelper.generateUUID()}`)
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

    it('should reject requests when the confirm is missing', (done) => {
      requestPayload.confirm = undefined;
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'confirm is missing from input',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when the confirm is not a string', (done) => {
      requestPayload.confirm = 2378499273849;
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: 'confirm must be a string',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when confirm does not match the project name', (done) => {
      requestPayload.confirm = 'NotRight';
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: `confirm must match the project name: ${testProject.name}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully remove a project', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          await testProject.reload();
          const { message, project } = res.body;
          expect(message).toBe('project has been successfully removed');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedOn: testProject.updatedOn?.toISOString() || null,
            updatedBy: testProject.updatedBy || null,
            deletedOn: testProject.deletedOn?.toISOString(),
            deletedBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
          });
          expect(testProject.isActive).toBe(false);
          done();
        });
    });
  });
});
