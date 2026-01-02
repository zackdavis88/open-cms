import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  Membership,
  MembershipData,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/memberships');
const request = testHelper.request;

describe('Get Memberships', () => {
  describe(`GET ${apiRoute}`, () => {
    let testProject: Project;
    let deletedProject: Project;
    let testUser: User;
    let authToken: string;
    let writeMembership1: Membership;
    let writeMembership2: Membership;
    let writeMembership3: Membership;
    let writeMembership6: Membership;
    let writeMembership7: Membership;
    let writeMembership8: Membership;
    let writeMembership9: Membership;
    let writeMembership10: Membership;
    let writeMembership11: Membership;
    let writeMembership12: Membership;
    let writeMembership13: Membership;
    let writeMembership14: Membership;
    let readMembership1: Membership;
    let readMembership2: Membership;

    beforeAll(async () => {
      testUser = await testHelper.createTestUser();
      authToken = testHelper.generateAuthToken(testUser);
      deletedProject = await testHelper.createTestProject({
        user: testUser,
        isActive: false,
      });
      const adminMember1 = await testHelper.createTestUser();
      testProject = await testHelper.createTestProject({ user: adminMember1 });
      const now = Date.now();
      const adminMember2 = await testHelper.createTestUser();
      await testHelper.createTestMembership({
        user: adminMember2,
        isAdmin: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now),
      });
      const adminMember3 = await testHelper.createTestUser();
      await testHelper.createTestMembership({
        user: adminMember3,
        isAdmin: true,
        createdBy: adminMember2,
        project: testProject,
        createdOn: new Date(now + 1),
      });

      const writeMember1 = await testHelper.createTestUser();
      const writeMember2 = await testHelper.createTestUser();
      const writeMember3 = await testHelper.createTestUser();
      const writeMember4 = await testHelper.createTestUser();
      const writeMember5 = await testHelper.createTestUser();
      const writeMember6 = await testHelper.createTestUser();
      const writeMember7 = await testHelper.createTestUser();
      const writeMember8 = await testHelper.createTestUser();
      const writeMember9 = await testHelper.createTestUser();
      const writeMember10 = await testHelper.createTestUser();
      const writeMember11 = await testHelper.createTestUser();
      const writeMember12 = await testHelper.createTestUser();
      const writeMember13 = await testHelper.createTestUser();
      const writeMember14 = await testHelper.createTestUser();
      const readMember1 = await testHelper.createTestUser();
      const readMember2 = await testHelper.createTestUser();
      writeMembership1 = await testHelper.createTestMembership({
        user: writeMember1,
        isWriter: true,
        createdBy: adminMember3,
        project: testProject,
        createdOn: new Date(now + 2),
      });
      writeMembership2 = await testHelper.createTestMembership({
        user: writeMember2,
        isWriter: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 3),
      });
      writeMembership3 = await testHelper.createTestMembership({
        user: writeMember3,
        isWriter: true,
        createdBy: adminMember3,
        project: testProject,
        createdOn: new Date(now + 4),
        updatedBy: adminMember2,
      });
      await testHelper.createTestMembership({
        user: writeMember4,
        isWriter: true,
        createdBy: adminMember3,
        project: testProject,
        createdOn: new Date(now + 5),
      });
      await testHelper.createTestMembership({
        user: writeMember5,
        isWriter: true,
        createdBy: adminMember2,
        project: testProject,
        createdOn: new Date(now + 6),
      });
      writeMembership6 = await testHelper.createTestMembership({
        user: writeMember6,
        isWriter: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 7),
        updatedBy: adminMember3,
      });
      writeMembership7 = await testHelper.createTestMembership({
        user: writeMember7,
        isWriter: true,
        createdBy: adminMember2,
        project: testProject,
        createdOn: new Date(now + 8),
      });
      writeMembership8 = await testHelper.createTestMembership({
        user: writeMember8,
        isWriter: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 9),
      });
      writeMembership9 = await testHelper.createTestMembership({
        user: writeMember9,
        isWriter: true,
        createdBy: adminMember3,
        project: testProject,
        createdOn: new Date(now + 10),
        updatedBy: adminMember3,
      });
      writeMembership10 = await testHelper.createTestMembership({
        user: writeMember10,
        isWriter: true,
        createdBy: adminMember2,
        project: testProject,
        createdOn: new Date(now + 11),
      });
      writeMembership11 = await testHelper.createTestMembership({
        user: writeMember11,
        isWriter: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 12),
      });
      writeMembership12 = await testHelper.createTestMembership({
        user: writeMember12,
        isWriter: true,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 13),
      });
      writeMembership13 = await testHelper.createTestMembership({
        user: writeMember13,
        isWriter: true,
        createdBy: adminMember3,
        project: testProject,
        createdOn: new Date(now + 14),
        updatedBy: adminMember2,
      });
      writeMembership14 = await testHelper.createTestMembership({
        user: writeMember14,
        isWriter: true,
        createdBy: adminMember2,
        project: testProject,
        createdOn: new Date(now + 15),
      });
      readMembership1 = await testHelper.createTestMembership({
        user: readMember1,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 16),
      });
      readMembership2 = await testHelper.createTestMembership({
        user: readMember2,
        createdBy: adminMember1,
        project: testProject,
        createdOn: new Date(now + 17),
      });
    });

    beforeEach(() => {
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/memberships`);
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

    it('should reject when project id is not a valid uuid', (done) => {
      request
        .get(testHelper.apiRoute('/projects/SomethingWrong/memberships'))
        .set('authorization', authToken)
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
        .get(testHelper.apiRoute(`/projects/${testHelper.generateUUID()}/memberships`))
        .set('authorization', authToken)
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}/memberships`))
        .set('authorization', authToken)
        .expect(
          404,
          {
            error: 'requested project not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should return a paginated list of memberships', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=6&page=1`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, project, memberships, ...paginationData } = res.body;
          // memberships are defaulted to createdBy DESC.
          // itemsPerPage is 6 in this example
          const expectedMemberships = [
            readMembership2,
            readMembership1,
            writeMembership14,
            writeMembership13,
            writeMembership12,
            writeMembership11,
          ];
          expect(message).toBe('membership list has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(memberships).toEqual(
            expectedMemberships.map((expectedMembership) => ({
              id: expectedMembership.id,
              user: {
                username: expectedMembership.user.username,
                displayName: expectedMembership.user.displayName,
                createdOn: expectedMembership.user.createdOn.toISOString(),
              },
              createdOn: expectedMembership.createdOn.toISOString(),
              createdBy: {
                username: expectedMembership.createdBy.username,
                displayName: expectedMembership.createdBy.displayName,
                createdOn: expectedMembership.createdBy.createdOn.toISOString(),
              },
              isAdmin: expectedMembership.isAdmin,
              isWriter: expectedMembership.isWriter,
              updatedOn: expectedMembership.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedMembership.updatedBy && {
                  username: expectedMembership.updatedBy.username,
                  displayName: expectedMembership.updatedBy.displayName,
                  createdOn: expectedMembership.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(paginationData).toEqual({
            page: 1,
            itemsPerPage: 6,
            totalItems: 19,
            totalPages: 4,
          });
          done();
        });
    });

    it('should allow filtering by createdOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=4&filterDateColumn=createdOn&filterDateValue=${writeMembership7.createdOn.toISOString()}&filterDateOp=gte&orderBy=asc`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedMemberships = [
            writeMembership7,
            writeMembership8,
            writeMembership9,
            writeMembership10,
          ];
          expect(memberships).toEqual(
            expectedMemberships.map((expectedMembership) => ({
              id: expectedMembership.id,
              user: {
                username: expectedMembership.user.username,
                displayName: expectedMembership.user.displayName,
                createdOn: expectedMembership.user.createdOn.toISOString(),
              },
              createdOn: expectedMembership.createdOn.toISOString(),
              createdBy: {
                username: expectedMembership.createdBy.username,
                displayName: expectedMembership.createdBy.displayName,
                createdOn: expectedMembership.createdBy.createdOn.toISOString(),
              },
              isAdmin: expectedMembership.isAdmin,
              isWriter: expectedMembership.isWriter,
              updatedOn: expectedMembership.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedMembership.updatedBy && {
                  username: expectedMembership.updatedBy.username,
                  displayName: expectedMembership.updatedBy.displayName,
                  createdOn: expectedMembership.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(3);
          expect(totalItems).toBe(10);
          expect(itemsPerPage).toBe(4);
          done();
        });
    });

    it('should allow filtering by updatedOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=4&filterDateColumn=updatedOn&filterDateValue=${writeMembership6.updatedOn?.toISOString()}&filterDateOp=eq`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedMemberships = [writeMembership6];
          expect(memberships).toEqual(
            expectedMemberships.map((expectedMembership) => ({
              id: expectedMembership.id,
              user: {
                username: expectedMembership.user.username,
                displayName: expectedMembership.user.displayName,
                createdOn: expectedMembership.user.createdOn.toISOString(),
              },
              createdOn: expectedMembership.createdOn.toISOString(),
              createdBy: {
                username: expectedMembership.createdBy.username,
                displayName: expectedMembership.createdBy.displayName,
                createdOn: expectedMembership.createdBy.createdOn.toISOString(),
              },
              isAdmin: expectedMembership.isAdmin,
              isWriter: expectedMembership.isWriter,
              updatedOn: expectedMembership.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedMembership.updatedBy && {
                  username: expectedMembership.updatedBy.username,
                  displayName: expectedMembership.updatedBy.displayName,
                  createdOn: expectedMembership.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(4);
          done();
        });
    });

    it('should allow filtering by isAdmin boolean', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterBooleanColumn=isAdmin&filterBooleanValue=true`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const everyMemberIsAdmin = memberships.every(
            (membership: Membership) => membership.isAdmin,
          );
          expect(everyMemberIsAdmin).toBe(true);
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(3);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by isWriter boolean', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterBooleanColumn=isWriter&filterBooleanValue=true`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const everyMemberIsWriter = memberships.every(
            (membership: Membership) => membership.isWriter,
          );
          expect(everyMemberIsWriter).toBe(true);
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by user username', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=9&filterStringColumn=__user_username&filterStringValue=${writeMembership1.user.displayName}`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const everyMemberHasUsername = memberships.every(
            (membership: Membership) =>
              membership.user.displayName === writeMembership1.user.displayName,
          );
          expect(everyMemberHasUsername).toBe(true);
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(9);
          done();
        });
    });

    it('should allow filtering by createdBy username', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=9&filterStringColumn=__createdBy_username&filterStringValue=${writeMembership2.createdBy.displayName}`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const everyMemberHasCreatedByUsername = memberships.every(
            (membership: Membership) =>
              membership.createdBy.displayName === writeMembership2.createdBy.displayName,
          );
          expect(everyMemberHasCreatedByUsername).toBe(true);
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(9);
          expect(itemsPerPage).toBe(9);
          done();
        });
    });

    it('should allow filtering by updatedBy username', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=64&filterStringColumn=__updatedBy_username&filterStringValue=${writeMembership3.updatedBy.displayName}`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          const everyMemberHasUpdatedByUsername = memberships.every(
            (membership: Membership) =>
              membership.updatedBy.displayName === writeMembership3.updatedBy.displayName,
          );
          expect(everyMemberHasUpdatedByUsername).toBe(true);
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(2);
          expect(itemsPerPage).toBe(64);
          done();
        });
    });

    it('should allow sorting by createdOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=createdOn&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (memberships[index + 1]) {
              expect(new Date(membership.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(memberships[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=updatedOn&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.updatedOn &&
              memberships[index + 1] &&
              memberships[index + 1].updatedOn
            ) {
              expect(new Date(membership.updatedOn).getTime()).toBeLessThanOrEqual(
                new Date(memberships[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedOn in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=updatedOn&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.updatedOn &&
              memberships[index + 1] &&
              memberships[index + 1].updatedOn
            ) {
              expect(new Date(membership.updatedOn).getTime()).toBeGreaterThanOrEqual(
                new Date(memberships[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by user username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__user_username&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.user &&
              memberships[index + 1] &&
              memberships[index + 1].user
            ) {
              expect(
                membership.user.username.toLowerCase() <=
                  memberships[index + 1].user.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by user username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__user_username&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.user &&
              memberships[index + 1] &&
              memberships[index + 1].user
            ) {
              expect(
                membership.user.username.toLowerCase() >=
                  memberships[index + 1].user.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by createdBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__createdBy_username&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.createdBy &&
              memberships[index + 1] &&
              memberships[index + 1].createdBy
            ) {
              expect(
                membership.createdBy.username.toLowerCase() <=
                  memberships[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by createdBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__createdBy_username&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.createdBy &&
              memberships[index + 1] &&
              memberships[index + 1].createdBy
            ) {
              expect(
                membership.createdBy.username.toLowerCase() >=
                  memberships[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__updatedBy_username&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.updatedBy &&
              memberships[index + 1] &&
              memberships[index + 1].updatedBy
            ) {
              expect(
                membership.updatedBy.username.toLowerCase() <=
                  memberships[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=__updatedBy_username&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (
              membership.updatedBy &&
              memberships[index + 1] &&
              memberships[index + 1].updatedBy
            ) {
              expect(
                membership.updatedBy.username.toLowerCase() >=
                  memberships[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by isAdmin in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=100&orderColumn=isAdmin&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (memberships[index + 1]) {
              expect(membership.isAdmin <= memberships[index + 1].isAdmin).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow sorting by isAdmin in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=100&orderColumn=isAdmin&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (memberships[index + 1]) {
              expect(membership.isAdmin >= memberships[index + 1].isAdmin).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow sorting by isWriter in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=100&orderColumn=isWriter&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (memberships[index + 1]) {
              expect(membership.isWriter <= memberships[index + 1].isWriter).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow sorting by isWriter in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=100&orderColumn=isWriter&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { memberships, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(memberships)) {
            return done('memberships is not an array');
          }

          memberships.forEach((membership: MembershipData, index) => {
            if (!membership || typeof membership !== 'object') {
              return done('membership data is not an object');
            }

            if (memberships[index + 1]) {
              expect(membership.isWriter >= memberships[index + 1].isWriter).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(19);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });
  });
});
