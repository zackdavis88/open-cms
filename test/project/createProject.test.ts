import { TestHelper, ERROR_TYPES, User, Membership } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/projects';
const request = testHelper.request;

describe('Create Project', () => {
  describe(`POST ${apiRoute}`, () => {
    let testUser: User;
    let authToken: string;
    let requestPayload: {
      name?: unknown;
      description?: unknown;
    };

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
    });

    beforeEach(() => {
      authToken = testHelper.generateAuthToken(testUser);
      requestPayload = {
        name: 'TestProject',
        description: 'Testing project create',
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

    it('should reject requests when name is missing', (done) => {
      requestPayload.name = undefined;
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'name is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when name is not a string', (done) => {
      requestPayload.name = false;
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
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
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
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
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
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
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
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
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
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
      request.post(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'description must be 350 characters or less',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should successfully create a project', (done) => {
      request
        .post(apiRoute)
        .set('authorization', authToken)
        .send(requestPayload)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, project } = res.body;
          expect(message).toBe('project has been successfully created');
          expect(project.id).toBeTruthy();
          expect(project.name).toBe(requestPayload.name);
          expect(project.description).toBe(requestPayload.description);
          expect(project.createdOn).toBeTruthy();
          expect(project.createdBy).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
          });

          // Validate that an admin membership was created for the user.
          const adminMembership = Membership.findOne({
            where: {
              projectId: project.id,
              userId: testUser.id,
              isAdmin: true,
            },
          });
          if (!adminMembership) {
            return done('admin membership was not found in database');
          }
          testHelper.addTestProjectId(project.id);
          done();
        });
    });
  });
});
