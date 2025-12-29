import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  Blueprint,
  BlueprintData,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = '/api/projects/:projectId/blueprints';
const request = testHelper.request;

describe('Get Blueprints', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let testProject: Project;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let testBlueprint1: Blueprint;
    let testBlueprint2: Blueprint;
    let testBlueprint3: Blueprint;
    let testBlueprint4: Blueprint;
    let testBlueprint5: Blueprint;
    let testBlueprint6: Blueprint;
    let testBlueprint7: Blueprint;
    let testBlueprint8: Blueprint;
    let testBlueprint9: Blueprint;
    let testBlueprint10: Blueprint;
    let testBlueprint11: Blueprint;
    let testBlueprint12: Blueprint;
    let testBlueprint13: Blueprint;
    let testBlueprint14: Blueprint;
    let testBlueprint15: Blueprint;
    let testBlueprint16: Blueprint;
    let testBlueprint17: Blueprint;
    let testBlueprint18: Blueprint;
    let testBlueprint19: Blueprint;
    let testBlueprint20: Blueprint;

    beforeAll(async () => {
      const now = Date.now();
      adminUser = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();
      const writeUser1 = await testHelper.createTestUser();
      const writeUser2 = await testHelper.createTestUser();
      readUser = await testHelper.createTestUser();
      deletedProject = await testHelper.createTestProject({
        isActive: false,
        user: adminUser,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testHelper.createTestMembership({
        project: testProject,
        user: readUser,
        createdBy: adminUser,
      });

      testBlueprint1 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 1),
      });

      testBlueprint2 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 2),
        updatedBy: adminUser,
      });

      testBlueprint3 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 3),
        updatedBy: adminUser,
      });

      testBlueprint4 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 4),
      });

      testBlueprint5 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writeUser1,
        createdOn: new Date(now + 5),
        updatedBy: adminUser,
      });

      testBlueprint6 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 6),
      });

      testBlueprint7 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writeUser1,
        createdOn: new Date(now + 7),
        updatedBy: adminUser,
      });

      testBlueprint8 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 8),
        updatedBy: adminUser,
      });

      testBlueprint9 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 9),
      });

      testBlueprint10 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 10),
      });

      testBlueprint11 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 11),
      });

      testBlueprint12 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writeUser1,
        createdOn: new Date(now + 12),
      });
      testBlueprint13 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: writeUser1,
        createdOn: new Date(now + 13),
      });
      testBlueprint14 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 14),
      });
      testBlueprint15 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 15),
      });
      testBlueprint16 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 16),
        updatedOn: new Date(now + 16),
        updatedBy: writeUser2,
      });
      testBlueprint17 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 17),
        updatedOn: new Date(now + 17),
        updatedBy: adminUser,
      });
      testBlueprint18 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 18),
        updatedOn: new Date(now + 18),
        updatedBy: adminUser,
      });
      testBlueprint19 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 19),
        updatedOn: new Date(now + 19),
        updatedBy: adminUser,
      });
      testBlueprint20 = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 20),
        updatedOn: new Date(now + 20),
        updatedBy: adminUser,
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = `/api/projects/${testProject.id}/blueprints`;
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
        .get('/api/projects/SomethingWrong/blueprints')
        .set('authorization', nonMemberAuthToken)
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
        .get(`/api/projects/${testHelper.generateUUID()}/blueprints`)
        .set('authorization', readerAuthToken)
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
        .get(`/api/projects/${deletedProject.id}/blueprints`)
        .set('authorization', readerAuthToken)
        .expect(
          404,
          {
            error: 'requested project not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject requests when the user is not a project member', (done) => {
      request.get(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should return a paginated list of blueprints', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=10&page=2`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, project, blueprints, ...paginationData } = res.body;
          const expectedBlueprints = [
            testBlueprint10,
            testBlueprint9,
            testBlueprint8,
            testBlueprint7,
            testBlueprint6,
            testBlueprint5,
            testBlueprint4,
            testBlueprint3,
            testBlueprint2,
            testBlueprint1,
          ];
          expect(message).toBe('blueprint list has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(paginationData).toEqual({
            page: 2,
            itemsPerPage: 10,
            totalItems: 20,
            totalPages: 2,
          });
          done();
        });
    });

    it('should allow filtering by createdOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=createdOn&filterDateValue=${testBlueprint15.createdOn.toISOString()}&filterDateOp=lte`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [
            testBlueprint15,
            testBlueprint14,
            testBlueprint13,
            testBlueprint12,
            testBlueprint11,
          ];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(3);
          expect(totalItems).toBe(15);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by updatedOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=updatedOn&filterDateValue=${testBlueprint16.updatedOn?.toISOString()}&filterDateOp=gte&orderBy=asc`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [
            testBlueprint16,
            testBlueprint17,
            testBlueprint18,
            testBlueprint19,
            testBlueprint20,
          ];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by name', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterStringColumn=name&filterStringValue=${testBlueprint1.name}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [testBlueprint1];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by name', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterStringColumn=name&filterStringValue=${testBlueprint1.name}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [testBlueprint1];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by createdBy username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__createdBy_username&filterStringValue=${testBlueprint12.createdBy.username}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [
            testBlueprint13,
            testBlueprint12,
            testBlueprint7,
            testBlueprint5,
          ];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(4);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by updatedBy username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__updatedBy_username&filterStringValue=${testBlueprint3.updatedBy.username}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedBlueprints = [
            testBlueprint20,
            testBlueprint19,
            testBlueprint18,
            testBlueprint17,
            testBlueprint8,
            testBlueprint7,
            testBlueprint5,
            testBlueprint3,
            testBlueprint2,
          ];
          expect(blueprints).toEqual(
            expectedBlueprints.map((expectedBlueprint) => ({
              id: expectedBlueprint.id,
              name: expectedBlueprint.name,
              createdOn: expectedBlueprint.createdOn.toISOString(),
              createdBy: {
                username: expectedBlueprint.createdBy.username,
                displayName: expectedBlueprint.createdBy.displayName,
                createdOn: expectedBlueprint.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedBlueprint.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedBlueprint.updatedBy && {
                  username: expectedBlueprint.updatedBy.username,
                  displayName: expectedBlueprint.updatedBy.displayName,
                  createdOn: expectedBlueprint.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(9);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow sorting by createdOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=createdOn&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (blueprints[index + 1]) {
              expect(new Date(blueprint.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(blueprints[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by createdOn in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=createdOn&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (blueprints[index + 1]) {
              expect(new Date(blueprint.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(blueprints[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=7&orderColumn=updatedOn&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.updatedOn &&
              blueprints[index + 1] &&
              blueprints[index + 1].updatedOn
            ) {
              expect(new Date(blueprint.updatedOn).getTime()).toBeLessThanOrEqual(
                new Date(blueprints[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(3);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(7);
          done();
        });
    });

    it('should allow sorting by updatedOn in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=7&orderColumn=updatedOn&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.updatedOn &&
              blueprints[index + 1] &&
              blueprints[index + 1].updatedOn
            ) {
              expect(new Date(blueprint.updatedOn).getTime()).toBeGreaterThanOrEqual(
                new Date(blueprints[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(3);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(7);
          done();
        });
    });

    it('should allow sorting by name in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=name&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (blueprints[index + 1]) {
              expect(
                blueprint.name.toLowerCase() <= blueprints[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by name in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=name&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (blueprints[index + 1]) {
              expect(
                blueprint.name.toLowerCase() >= blueprints[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by createdBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__createdBy_username&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.createdBy &&
              blueprints[index + 1] &&
              blueprints[index + 1].createdBy
            ) {
              expect(
                blueprint.createdBy.username.toLowerCase() <=
                  blueprints[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by createdBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__createdBy_username&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.createdBy &&
              blueprints[index + 1] &&
              blueprints[index + 1].createdBy
            ) {
              expect(
                blueprint.createdBy.username.toLowerCase() >=
                  blueprints[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by updatedBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__updatedBy_username&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.updatedBy &&
              blueprints[index + 1] &&
              blueprints[index + 1].updatedBy
            ) {
              expect(
                blueprint.updatedBy.username.toLowerCase() <=
                  blueprints[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by updatedBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__updatedBy_username&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { blueprints, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(blueprints)) {
            return done('blueprints is not an array');
          }

          blueprints.forEach((blueprint: BlueprintData, index) => {
            if (!blueprint || typeof blueprint !== 'object') {
              return done('blueprint data is not an object');
            }

            if (
              blueprint.updatedBy &&
              blueprints[index + 1] &&
              blueprints[index + 1].updatedBy
            ) {
              expect(
                blueprint.updatedBy.username.toLowerCase() >=
                  blueprints[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(20);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });
  });
});
