import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/users/:username');
const request = testHelper.request;

describe('Get User', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let deletedUser: User;
    let authToken: string;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      apiRoute = testHelper.apiRoute(`/users/${testUser.displayName}`);
      authToken = testHelper.generateAuthToken(testUser);
      deletedUser = await testHelper.createTestUser({ isActive: false });
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

    it('should reject when user is deleted', (done) => {
      request
        .get(testHelper.apiRoute(`/users/${deletedUser.id}`))
        .set('authorization', authToken)
        .expect(
          404,
          {
            error: 'requested user not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when user is not found', (done) => {
      request
        .get(testHelper.apiRoute('/users/DoesNotExi$t'))
        .set('authorization', authToken)
        .expect(
          404,
          {
            error: 'requested user not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should return user data', (done) => {
      request
        .get(apiRoute)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, user } = res.body;
          expect(message).toBe('user has been successfully retrieved');
          expect(user).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
          });

          done();
        });
    });
  });
});
