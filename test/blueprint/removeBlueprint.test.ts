import { TestHelper, ERROR_TYPES, User, Project, Blueprint } from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId/blueprints/:blueprintId';
const request = testHelper.request;

describe('Delete Blueprint', () => {
  describe(`DELETE ${apiRoute}`, () => {
    let adminUser: User;
    let writerUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let adminAuthToken: string;
    let writerAuthToken: string;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let testBlueprint: Blueprint;
    let deletedBlueprint: Blueprint;
    let requestPayload: {
      confirm?: unknown;
    };

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
        updatedBy: writerUser,
      });

      deletedBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        isActive: false,
      });
    });

    beforeEach(() => {
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      writerAuthToken = testHelper.generateAuthToken(writerUser);
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = `/api/projects/${testProject.id}/blueprints/${testBlueprint.id}`;
      requestPayload = {
        confirm: testBlueprint.name,
      };
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

    it('should reject when project id is not a valid uuid', (done) => {
      request
        .delete(`/api/projects/SomethingWrong/blueprints/${crypto.randomUUID()}`)
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
          `/api/projects/${testHelper.generateUUID()}/blueprints/${crypto.randomUUID()}`,
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
        .delete(`/api/projects/${deletedProject.id}/blueprints/${crypto.randomUUID()}`)
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

    it('should reject when blueprint id is not a valid uuid', (done) => {
      request
        .delete(`/api/projects/${testProject.id}/blueprints/wrong`)
        .set('authorization', adminAuthToken)
        .expect(
          422,
          {
            error: 'requested blueprint id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when blueprint is not found', (done) => {
      request
        .delete(`/api/projects/${testProject.id}/blueprints/${crypto.randomUUID()}`)
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when blueprint is deleted', (done) => {
      request
        .delete(`/api/projects/${testProject.id}/blueprints/${deletedBlueprint.id}`)
        .set('authorization', adminAuthToken)
        .expect(
          404,
          {
            error: 'requested blueprint not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when confirm is missing', (done) => {
      request.delete(apiRoute).set('authorization', writerAuthToken).expect(
        422,
        {
          error: 'confirm is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject when confirm is not a string', (done) => {
      requestPayload.confirm = 123;
      request
        .delete(apiRoute)
        .set('authorization', writerAuthToken)
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

    it('should reject when confirm does not match blueprint name', (done) => {
      requestPayload.confirm = 'NotTheName';
      request
        .delete(apiRoute)
        .set('authorization', writerAuthToken)
        .send(requestPayload)
        .expect(
          422,
          {
            error: `confirm must match the blueprint name: ${testBlueprint.name}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully delete a blueprint', (done) => {
      request
        .delete(apiRoute)
        .set('authorization', adminAuthToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          const { message, blueprint } = res.body;
          expect(message).toBe('blueprint has been successfully removed');
          expect(blueprint).toMatchObject({
            id: testBlueprint.id,
            name: testBlueprint.name,
            fields: testBlueprint.fields,
            createdOn: testBlueprint.createdOn.toISOString(),
            createdBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
            updatedOn: testBlueprint.updatedOn?.toISOString() || null,
            updatedBy: {
              username: writerUser.username,
              displayName: writerUser.displayName,
              createdOn: writerUser.createdOn.toISOString(),
            },
          });

          await testBlueprint.reload();
          expect(testBlueprint.isActive).toBe(false);
          expect(blueprint.deletedOn).toBe(testBlueprint.deletedOn?.toISOString());
          expect(blueprint.deletedBy).toEqual({
            username: adminUser.username,
            displayName: adminUser.displayName,
            createdOn: adminUser.createdOn.toISOString(),
          });
          done();
        });
    });
  });
});
