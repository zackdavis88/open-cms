import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/users/me';
const request = testHelper.request;

interface RemoveUserPayload {
  confirm?: unknown;
}

describe('Remove User', () => {
  describe(`DELETE ${apiRoute}`, () => {
    let testUser: User;
    let authToken: string;
    const payload: RemoveUserPayload = {};

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      authToken = testHelper.generateAuthToken(testUser);
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    it('should require authentication', (done) => {
      request.delete(apiRoute).expect(
        401,
        {
          error: 'authorization header is missing from input',
          errorType: ERROR_TYPES.AUTHENTICATION,
        },
        done,
      );
    });

    it('should reject requests when confirm is missing', (done) => {
      payload.confirm = undefined;
      request
        .delete(apiRoute)
        .set('authorization', authToken)
        .send(payload)
        .expect(
          422,
          { error: 'confirm is missing from input', errorType: ERROR_TYPES.VALIDATION },
          done,
        );
    });

    it('should reject requests when confirm is not a string', (done) => {
      payload.confirm = 123456;
      request
        .delete(apiRoute)
        .set('authorization', authToken)
        .send(payload)
        .expect(
          422,
          { error: 'confirm must be a string', errorType: ERROR_TYPES.VALIDATION },
          done,
        );
    });

    it('should reject requests when confirm does not match displayName', (done) => {
      payload.confirm = 'notCorrect';
      request
        .delete(apiRoute)
        .set('authorization', authToken)
        .send(payload)
        .expect(
          422,
          {
            error: `confirm must match your displayName: ${testUser.displayName}`,
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully remove a user', (done) => {
      payload.confirm = testUser.displayName;
      request
        .delete(apiRoute)
        .set('authorization', authToken)
        .send(payload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          await testUser.reload();
          const { message, user } = res.body;

          expect(message).toBe('user has been successfully removed');
          expect(user).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
            updatedOn: testUser.updatedOn?.toISOString() || null,
            deletedOn: testUser.deletedOn?.toISOString(),
          });
          expect(testUser.isActive).toBe(false);
          done();
        });
    });
  });
});
