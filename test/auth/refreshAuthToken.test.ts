import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/auth/refresh';
const request = testHelper.request;

describe('Refresh Auth Token', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let inactiveUser: User;
    let authToken: string;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      inactiveUser = await testHelper.createTestUser('Password1', false);
    });

    beforeEach(() => {
      authToken = testHelper.generateAuthToken(testUser);
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should reject requests when the header is missing', (done) => {
      request.get(apiRoute).expect(
        401,
        {
          error: 'authorization header is missing from input',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when the header does not use the Bearer auth-scheme', (done) => {
      request.get(apiRoute).set('Authorization', authToken).expect(
        401,
        {
          error: 'authorization header must use Bearer schema',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header is encrypted with the wrong secret key', (done) => {
      const secretOverride = 'badSecret';
      const badToken = testHelper.generateAuthToken(testUser, {}, secretOverride);
      const authHeader = `Bearer ${badToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header could not be verified',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header decrypted value is a string', (done) => {
      const badToken = testHelper.generateAuthToken(testUser, 'this shouldnt work');
      const authHeader = `Bearer ${badToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header decrypted value does not have a user id', (done) => {
      const badToken = testHelper.generateAuthToken(testUser, { id: undefined });
      const authHeader = `Bearer ${badToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header decrypted value does not have a user apiKey', (done) => {
      const badToken = testHelper.generateAuthToken(testUser, { apiKey: undefined });
      const authHeader = `Bearer ${badToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header is invalid',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when authenticating user is not found', (done) => {
      const badToken = testHelper.generateAuthToken(testUser, {
        apiKey: testHelper.generateUUID(),
      });
      const authHeader = `Bearer ${badToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header could not be authenticated',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when authenticating user is not active', (done) => {
      const inactiveAuthToken = testHelper.generateAuthToken(inactiveUser);
      const authHeader = `Bearer ${inactiveAuthToken}`;
      request.get(apiRoute).set('authorization', authHeader).expect(
        401,
        {
          error: 'authorization header could not be authenticated',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should successfully refresh an auth token', (done) => {
      const TEN_HOURS_AND_ONE_SECOND = 60 * 60 * 10 + 1;
      const tokenOverrides = {
        iat: Math.floor(Date.now() / 1000) - TEN_HOURS_AND_ONE_SECOND,
        exp: Math.floor(Date.now() / 1000),
      };
      const expiredAuthToken = testHelper.generateAuthToken(testUser, tokenOverrides);
      const authHeader = `Bearer ${expiredAuthToken}`;
      request
        .get(apiRoute)
        .set('authorization', authHeader)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, user, authToken } = res.body;
          expect(message).toBe('authToken successfully refreshed');
          expect(authToken).toBeTruthy();
          expect(authToken).not.toEqual(expiredAuthToken);
          expect(user).toStrictEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
            updatedOn: testUser.updatedOn,
          });
          done();
        });
    });
  });
});
