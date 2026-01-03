import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  Layout,
  Component,
  LayoutData,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/layouts');
const request = testHelper.request;

describe('Get Layouts', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let nonMemberUser: User;
    let readAuthToken: string;
    let nonMemberAuthToken: string;
    let testProject: Project;
    let deletedProject: Project;
    let testComponent1: Component;
    let testComponent2: Component;
    let testComponent3: Component;
    let testComponent4: Component;
    let testComponent5: Component;
    let testComponent6: Component;
    let testComponent7: Component;
    let testComponent8: Component;
    let testComponent9: Component;
    let testComponent10: Component;
    let testComponent11: Component;
    let testComponent12: Component;
    let testComponent13: Component;
    let testLayout1: Layout;
    let testLayout2: Layout;
    let testLayout3: Layout;
    let testLayout4: Layout;
    let testLayout5: Layout;
    let testLayout6: Layout;

    beforeAll(async () => {
      const now = Date.now();
      adminUser = await testHelper.createTestUser();
      nonMemberUser = await testHelper.createTestUser();
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
      const testBlueprint = await testHelper.createTestBlueprint({
        project: testProject,
        createdBy: adminUser,
      });
      testComponent1 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent2 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent3 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent4 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent5 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent6 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent7 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent8 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent9 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent10 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent11 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent12 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });
      testComponent13 = await testHelper.createTestComponent({
        project: testProject,
        blueprint: testBlueprint,
        createdBy: adminUser,
      });

      testLayout1 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 1),
        layoutComponents: [
          testComponent1,
          testComponent2,
          testComponent3,
          testComponent4,
          testComponent5,
          testComponent6,
          testComponent1,
        ],
      });
      testLayout2 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 2),
        layoutComponents: [
          testComponent7,
          testComponent8,
          testComponent9,
          testComponent10,
          testComponent11,
          testComponent12,
          testComponent13,
        ],
      });
      testLayout3 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 3),
        updatedBy: adminUser,
        updatedOn: new Date(now + 3),
        layoutComponents: [testComponent7, testComponent7, testComponent7],
      });
      testLayout4 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 4),
        updatedBy: adminUser,
        updatedOn: new Date(now + 4),
        layoutComponents: [
          testComponent6,
          testComponent9,
          testComponent6,
          testComponent7,
        ],
      });
      testLayout5 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 5),
        updatedOn: new Date(now + 5),
        updatedBy: adminUser,
        layoutComponents: [
          testComponent1,
          testComponent2,
          testComponent3,
          testComponent5,
          testComponent8,
          testComponent13,
        ],
      });
      testLayout6 = await testHelper.createTestLayout({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 6),
        layoutComponents: [testComponent1],
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(nonMemberUser);
      readAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/layouts`);
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
        .get(testHelper.apiRoute('/projects/SomethingWrong/layouts'))
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
        .get(testHelper.apiRoute(`/projects/${crypto.randomUUID()}/layouts`))
        .set('authorization', readAuthToken)
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}/layouts`))
        .set('authorization', readAuthToken)
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

    it('should return a paginated list of layouts', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=2&page=1`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { message, project, layouts, ...paginationData } = res.body;
          const expectedLayouts = [testLayout6, testLayout5];
          expect(message).toBe('layout list has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => {
              return {
                id: expectedLayout.id,
                name: expectedLayout.name,
                createdOn: expectedLayout.createdOn.toISOString(),
                createdBy: {
                  username: expectedLayout.createdBy.username,
                  displayName: expectedLayout.createdBy.displayName,
                  createdOn: expectedLayout.createdBy.createdOn.toISOString(),
                },
                updatedOn: expectedLayout.updatedOn?.toISOString() || null,
                updatedBy:
                  (expectedLayout.updatedBy && {
                    username: expectedLayout.updatedBy.username,
                    displayName: expectedLayout.updatedBy.displayName,
                    createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
                  }) ||
                  null,
              };
            }),
          );
          expect(paginationData).toEqual({
            page: 1,
            itemsPerPage: 2,
            totalItems: 6,
            totalPages: 3,
          });
          done();
        });
    });

    it('should allow filtering by createdOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=createdOn&filterDateValue=${testLayout5.createdOn.toISOString()}&filterDateOp=gt`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedLayouts = [testLayout6];
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => ({
              id: expectedLayout.id,
              name: expectedLayout.name,
              createdOn: expectedLayout.createdOn.toISOString(),
              createdBy: {
                username: expectedLayout.createdBy.username,
                displayName: expectedLayout.createdBy.displayName,
                createdOn: expectedLayout.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedLayout.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedLayout.updatedBy && {
                  username: expectedLayout.updatedBy.username,
                  displayName: expectedLayout.updatedBy.displayName,
                  createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by updatedOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=updatedOn&filterDateValue=${testLayout3.updatedOn?.toISOString()}&filterDateOp=lte`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedLayouts = [testLayout3];
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => ({
              id: expectedLayout.id,
              name: expectedLayout.name,
              createdOn: expectedLayout.createdOn.toISOString(),
              createdBy: {
                username: expectedLayout.createdBy.username,
                displayName: expectedLayout.createdBy.displayName,
                createdOn: expectedLayout.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedLayout.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedLayout.updatedBy && {
                  username: expectedLayout.updatedBy.username,
                  displayName: expectedLayout.updatedBy.displayName,
                  createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by name', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterStringColumn=name&filterStringValue=${testLayout6.name}`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedLayouts = [testLayout6];
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => ({
              id: expectedLayout.id,
              name: expectedLayout.name,
              createdOn: expectedLayout.createdOn.toISOString(),
              createdBy: {
                username: expectedLayout.createdBy.username,
                displayName: expectedLayout.createdBy.displayName,
                createdOn: expectedLayout.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedLayout.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedLayout.updatedBy && {
                  username: expectedLayout.updatedBy.username,
                  displayName: expectedLayout.updatedBy.displayName,
                  createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
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
          `${apiRoute}?filterStringColumn=__createdBy_username&filterStringValue=${testLayout1.createdBy.username}&orderBy=asc`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedLayouts = [
            testLayout1,
            testLayout2,
            testLayout3,
            testLayout4,
            testLayout5,
            testLayout6,
          ];
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => ({
              id: expectedLayout.id,
              name: expectedLayout.name,
              createdOn: expectedLayout.createdOn.toISOString(),
              createdBy: {
                username: expectedLayout.createdBy.username,
                displayName: expectedLayout.createdBy.displayName,
                createdOn: expectedLayout.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedLayout.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedLayout.updatedBy && {
                  username: expectedLayout.updatedBy.username,
                  displayName: expectedLayout.updatedBy.displayName,
                  createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by updatedBy username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__updatedBy_username&filterStringValue=${adminUser.displayName}`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedLayouts = [testLayout5, testLayout4, testLayout3];
          expect(layouts).toEqual(
            expectedLayouts.map((expectedLayout) => ({
              id: expectedLayout.id,
              name: expectedLayout.name,
              createdOn: expectedLayout.createdOn.toISOString(),
              createdBy: {
                username: expectedLayout.createdBy.username,
                displayName: expectedLayout.createdBy.displayName,
                createdOn: expectedLayout.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedLayout.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedLayout.updatedBy && {
                  username: expectedLayout.updatedBy.username,
                  displayName: expectedLayout.updatedBy.displayName,
                  createdOn: expectedLayout.updatedBy.createdOn.toISOString(),
                }) ||
                null,
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(3);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow sorting by createdOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=createdOn&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layouts[index + 1]) {
              expect(new Date(layout.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(layouts[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by createdOn in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=18&orderColumn=createdOn&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layouts[index + 1]) {
              expect(new Date(layout.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(layouts[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by updatedOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=7&orderColumn=updatedOn&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.updatedOn && layouts[index + 1] && layouts[index + 1].updatedOn) {
              expect(new Date(layout.updatedOn).getTime()).toBeLessThanOrEqual(
                new Date(layouts[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(7);
          done();
        });
    });

    it('should allow sorting by updatedOn in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=7&orderColumn=updatedOn&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.updatedOn && layouts[index + 1] && layouts[index + 1].updatedOn) {
              expect(new Date(layout.updatedOn).getTime()).toBeGreaterThanOrEqual(
                new Date(layouts[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(7);
          done();
        });
    });

    it('should allow sorting by name in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=name&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layouts[index + 1]) {
              expect(
                layout.name.toLowerCase() <= layouts[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by name in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=name&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layouts[index + 1]) {
              expect(
                layout.name.toLowerCase() >= layouts[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by createdBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__createdBy_username&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.createdBy && layouts[index + 1] && layouts[index + 1].createdBy) {
              expect(
                layout.createdBy.username.toLowerCase() <=
                  layouts[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by createdBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__createdBy_username&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.createdBy && layouts[index + 1] && layouts[index + 1].createdBy) {
              expect(
                layout.createdBy.username.toLowerCase() >=
                  layouts[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by updatedBy username in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__updatedBy_username&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.updatedBy && layouts[index + 1] && layouts[index + 1].updatedBy) {
              expect(
                layout.updatedBy.username.toLowerCase() <=
                  layouts[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by updatedBy username in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__updatedBy_username&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { layouts, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(layouts)) {
            return done('layouts is not an array');
          }

          layouts.forEach((layout: LayoutData, index) => {
            if (!layout || typeof layout !== 'object') {
              return done('layout data is not an object');
            }

            if (layout.updatedBy && layouts[index + 1] && layouts[index + 1].updatedBy) {
              expect(
                layout.updatedBy.username.toLowerCase() >=
                  layouts[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(6);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });
  });
});
