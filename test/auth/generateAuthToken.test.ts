import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/auth';
const request = testHelper.request;

describe('Generate Auth Token', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    const testUserPassword = ':w3!rD:::::p@s$word';

    beforeAll(async () => {
      testUser = await testHelper.createTestUser(testUserPassword);
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should reject requests when the Authorization header is missing', (done) => {
      request.get(apiRoute).expect(
        401,
        {
          error: 'authorization header is missing from input',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when the header cannot be parsed', (done) => {
      const encodedCreds = Buffer.from('username/password').toString('base64');
      const basicAuthHeader = `Basic ${encodedCreds}`;
      request.get(apiRoute).set('Authorization', basicAuthHeader).expect(
        401,
        {
          error: 'username and password combination is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when the user is not found', (done) => {
      const encodedCreds = Buffer.from('DoesNotExi$t/Password1').toString('base64');
      const basicAuthHeader = `Basic ${encodedCreds}`;
      request.get(apiRoute).set('Authorization', basicAuthHeader).expect(
        401,
        {
          error: 'username and password combination is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when the password is invalid', (done) => {
      const encodedCreds = Buffer.from(`${testUser.displayName}:Password1}`).toString(
        'base64',
      );
      const basicAuthHeader = `Basic ${encodedCreds}`;
      request.get(apiRoute).set('Authorization', basicAuthHeader).expect(
        401,
        {
          error: 'username and password combination is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should successfully generate an auth token', (done) => {
      const encodedCreds = Buffer.from(
        `${testUser.displayName}:${testUserPassword}`,
      ).toString('base64');
      const basicAuthHeader = `Basic ${encodedCreds}`;
      request
        .get(apiRoute)
        .set('Authorization', basicAuthHeader)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, user, authToken } = res.body;
          expect(authToken).toBeTruthy();
          expect(message).toBe('user successfully authenticated');
          expect(user).toStrictEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
            updatedOn: null,
          });
          done();
        });
    });
  });
});
