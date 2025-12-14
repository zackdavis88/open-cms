import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/users/password';
const request = testHelper.request;

describe('Update Password', () => {
  describe(`PATCH ${apiRoute}`, () => {
    let testUser: User;
    let authToken: string;
    let requestPayload: {
      currentPassword?: unknown;
      newPassword?: unknown;
    };
    const newPassword = 'PasswordUpdated2';

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
    });

    beforeEach(() => {
      authToken = testHelper.generateAuthToken(testUser);
      requestPayload = {
        currentPassword: 'Password1',
        newPassword,
      };
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

    it('should reject requests when currentPassword is missing', (done) => {
      requestPayload.currentPassword = undefined;
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'currentPassword is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when currentPassword is not a string', (done) => {
      requestPayload.currentPassword = 123252345564;
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'currentPassword must be a string',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when currentPassword is not valid', (done) => {
      requestPayload.currentPassword = 'NotTheRightPassword';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'currentPassword input is invalid',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when currentPassword is not valid', (done) => {
      requestPayload.currentPassword = 'NotTheRightPassword';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'currentPassword input is invalid',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when currentPassword and newPassword are the same value', (done) => {
      requestPayload.currentPassword = 'Password1';
      requestPayload.newPassword = 'Password1';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'currentPassword and newPassword are the same',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword is missing', (done) => {
      requestPayload.newPassword = undefined;
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword is not a string', (done) => {
      requestPayload.newPassword = { something: 'wrong' };
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword must be a string',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword is less than 8 characters', (done) => {
      requestPayload.newPassword = 'short';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword must be at least 8 characters in length',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword has no uppercase characters', (done) => {
      requestPayload.newPassword = 'password1';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword has no lowercase characters', (done) => {
      requestPayload.newPassword = 'PASSWORD1';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when newPassword has no number characters', (done) => {
      requestPayload.newPassword = 'Password_One';
      request.patch(apiRoute).set('authorization', authToken).send(requestPayload).expect(
        422,
        {
          error: 'newPassword must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should successfully update a password', (done) => {
      request
        .patch(apiRoute)
        .set('authorization', authToken)
        .send(requestPayload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          await testUser.reload();

          const { message, user } = res.body;
          expect(message).toBe('user password successfully updated');
          expect(user).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
            updatedOn: testUser.updatedOn?.toISOString(),
          });

          // Ensure the new password is valid.
          if (!testUser.compareHash(newPassword)) {
            return done('password is not updated in the database');
          }
          done();
        });
    });
  });
});
