import { TestHelper, ERROR_TYPES, User } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/users';
const request = testHelper.request;

describe('User Create', () => {
  describe(`POST ${apiRoute}`, () => {
    let existingUsername: string;
    let payload: {
      username?: unknown;
      password?: unknown;
    };

    beforeAll(async () => {
      const testUser = await testHelper.createTestUser();
      existingUsername = testUser.username;
    });

    afterAll(async () => {
      await testHelper.removeTestData();
    });

    beforeEach(() => {
      payload = {
        username: testHelper.generateUUID().slice(0, 12).toUpperCase(),
        password: 'Password1',
      };
    });

    it('should reject requests when username is missing', (done) => {
      payload.username = undefined;
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'username is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when username is not a string', (done) => {
      payload.username = { something: 'wrong' };
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'username must be a string',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when username is less than 3 characters', (done) => {
      payload.username = '12';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'username must be 3 - 30 characters in length',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when username is more than 30 characters', (done) => {
      payload.username = 'abcdefghijklmnopqrstuvwxyz123456';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'username must be 3 - 30 characters in length',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when username contains invalid characters', (done) => {
      payload.username = 'u$ername!';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error:
            'username may only contain alphanumeric, - (dash), and _ (underscore) characters',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when username is already taken', (done) => {
      payload.username = existingUsername;
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'username is already taken',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password is missing', (done) => {
      payload.password = undefined;
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password is missing from input',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password is not a string', (done) => {
      payload.password = { something: 'wrong' };
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password must be a string',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password is less than 8 characters', (done) => {
      payload.password = 'short';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password must be at least 8 characters in length',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password has no uppercase characters', (done) => {
      payload.password = 'password1';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password has no lowercase characters', (done) => {
      payload.password = 'PASSWORD1';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should reject requests when password has no number characters', (done) => {
      payload.password = 'Password_One';
      request.post(apiRoute).send(payload).expect(
        422,
        {
          error: 'password must have 1 uppercase, lowercase, and number character',
          errorType: ERROR_TYPES.VALIDATION,
        },
        done,
      );
    });

    it('should successfully create a user', (done) => {
      request
        .post(apiRoute)
        .send(payload)
        .expect(200)
        .end(async (err, res) => {
          if (err) {
            return done(err);
          }

          // Ensure the user was actually created
          const createdUser = await User.findOne({
            where: {
              username: String(payload.username).toLowerCase(),
              isActive: true,
            },
          });
          if (!createdUser) {
            return done('created user was not found in database');
          }

          const { message, user } = res.body;
          expect(message).toBe('user has been successfully created');
          expect(user).toEqual({
            username: String(payload.username).toLowerCase(),
            displayName: payload.username,
            createdOn: createdUser.createdOn.toISOString(),
          });

          // Ensure the password is valid.
          expect(createdUser.compareHash(String(payload.password))).toBe(true);
          testHelper.addTestUsername(user.username);
          done();
        });
    });
  });
});
