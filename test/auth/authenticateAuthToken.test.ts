import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/auth/me';
const request = testHelper.request;

const TEN_HOURS_AND_ONE_SECOND = 60 * 60 * 10 + 1;

describe('Authenticate Me', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let inactiveUser: User;
    let recentlyUpdatedUser: User;
    let authToken: string;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      inactiveUser = await testHelper.createTestUser('Password1', false);
      // Create a user and set an updatedOn date for them.
      recentlyUpdatedUser = await testHelper.createTestUser();
      recentlyUpdatedUser.updatedOn = new Date();
      await recentlyUpdatedUser.save();
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
      authToken = 'somethingStringValueThatDoesntHaveBearer';
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
      request.get(apiRoute).set('authorization', badToken).expect(
        401,
        {
          error: 'authorization header could not be verified',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header is expired', (done) => {
      const tokenOverrides = {
        iat: Math.floor(Date.now() / 1000) - TEN_HOURS_AND_ONE_SECOND,
        exp: Math.floor(Date.now() / 1000),
      };
      const expiredAuthToken = testHelper.generateAuthToken(testUser, tokenOverrides);
      request.get(apiRoute).set('authorization', expiredAuthToken).expect(
        401,
        {
          error: 'authorization header is expired',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when header decrypted value is a string', (done) => {
      const badToken = testHelper.generateAuthToken(testUser, 'this shouldnt work');
      request.get(apiRoute).set('authorization', badToken).expect(
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
      request.get(apiRoute).set('authorization', badToken).expect(
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
      request.get(apiRoute).set('authorization', badToken).expect(
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
      request.get(apiRoute).set('authorization', badToken).expect(
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
      request.get(apiRoute).set('authorization', inactiveAuthToken).expect(
        401,
        {
          error: 'authorization header could not be authenticated',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when authenticating user has changed their password', (done) => {
      const authToken = testHelper.generateAuthToken(recentlyUpdatedUser, {
        iat: Math.floor(
          (recentlyUpdatedUser.updatedOn ?? new Date()).getTime() / 1000 - 1,
        ),
      });
      request.get(apiRoute).set('authorization', authToken).expect(
        401,
        {
          error: 'authorization header is expired',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should successfully authenticate an auth token', (done) => {
      request
        .get(apiRoute)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, user } = res.body;
          expect(message).toBe('user successfully authenticated');
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
