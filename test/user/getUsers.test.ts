import { TestHelper, ERROR_TYPES, User, UserData } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/users';
const request = testHelper.request;

describe('Get Users', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let authToken: string;
    const createdOnTimestamp = new Date(Date.now() + 5000);

    beforeAll(async () => {
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      await testHelper.createTestUser();
      testUser = await testHelper.createTestUser({
        createdOn: createdOnTimestamp,
      });
      authToken = testHelper.generateAuthToken(testUser);
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

    it('should return a paginated list of users in descending order of create date', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=10&page=1`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          // This is kinda tricky because I dont want to require that the DB always be empty to run this test successfully.
          // We dont know the total number of users when this test runs but we know it is at least 10.
          const { message, users } = res.body;
          expect(message).toBe('user list has been successfully retrieved');
          expect(users).toBeTruthy();
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(10);
          users.forEach((user: UserData, index) => {
            if (!user || typeof user !== 'object') {
              return done('user data is not an object');
            }

            expect(user.username).toBeTruthy();
            expect(user.displayName).toBeTruthy();
            expect(user.createdOn).toBeTruthy();
            expect(user.updatedOn).toBeUndefined(); // This is a private field, we should not see this data on this endpoint.

            // Each timestamp should be greater than the next.
            if (users[index + 1]) {
              expect(new Date(user.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(users[index + 1].createdOn).getTime(),
              );
            }
          });

          done();
        });
    });

    it('should allow sorting by ascending order of create date', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=createdon&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { users } = res.body;
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(10);
          users.forEach((user: UserData, index) => {
            if (!user || typeof user !== 'object') {
              return done('user data is not an object');
            }

            // Each timestamp should be less than the next.
            if (users[index + 1]) {
              expect(new Date(user.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(users[index + 1].createdOn).getTime(),
              );
            }
          });

          done();
        });
    });

    it('should allow sorting by descending order of username', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=username&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { users } = res.body;
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(10);
          users.forEach((user: UserData, index) => {
            if (!user || typeof user !== 'object') {
              return done('user data is not an object');
            }

            // Each username should be greater than the next.
            if (users[index + 1]) {
              expect(user.username > users[index + 1].username).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow sorting by ascending order of username', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=username&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { users } = res.body;
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(10);
          users.forEach((user: UserData, index) => {
            if (!user || typeof user !== 'object') {
              return done('user data is not an object');
            }

            // Each username should be greater than the next.
            if (users[index + 1]) {
              expect(user.username < users[index + 1].username).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow filtering by username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=username&filterStringValue=${testUser.username}`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { users }: { users: UserData[] } = res.body;
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(1);
          expect(users[0]).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
          });

          done();
        });
    });

    it('should allow filtering by createdOn', (done) => {
      request
        .get(
          `${apiRoute}?filterDateColumn=createdOn&filterDateValue=${createdOnTimestamp.toISOString()}&filterDateOp=gte`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { users }: { users: UserData[] } = res.body;
          if (!Array.isArray(users)) {
            return done('users data is not an array');
          }
          expect(users.length).toBe(1);
          expect(users[0]).toEqual({
            username: testUser.username,
            displayName: testUser.displayName,
            createdOn: testUser.createdOn.toISOString(),
          });

          done();
        });
    });
  });
});
