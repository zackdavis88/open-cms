import {
  TestHelper,
  ERROR_TYPES,
  User,
  Project,
  Blueprint,
  BlueprintVersion,
  Component,
  ComponentData,
} from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/components');
const request = testHelper.request;

describe('Get Components', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let deletedProject: Project;
    let testUser: User;
    let writeUser1: User;
    let writeUser2: User;
    let testProject: Project;
    let readerAuthToken: string;
    let nonMemberAuthToken: string;
    let testBlueprint1: Blueprint;
    let testBlueprint2: Blueprint;
    let testBlueprint3: Blueprint;
    let testBlueprint4: Blueprint;
    let testBlueprintVersion: BlueprintVersion;
    let testComponent1: Component;
    let testComponent2: Component;
    let testComponent3: Component;
    let testComponent4: Component;
    let testComponent5: Component;
    beforeAll(async () => {
      const now = Date.now();
      adminUser = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();
      writeUser1 = await testHelper.createTestUser();
      writeUser2 = await testHelper.createTestUser();
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

      testBlueprintVersion = await testBlueprint4.createVersion({
        name: crypto.randomUUID(),
        fields: testBlueprint4.fields,
        createdById: adminUser.id,
      });

      testComponent1 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: adminUser,
        blueprint: testBlueprint1,
        createdOn: new Date(now + 5),
      });

      testComponent2 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writeUser1,
        blueprint: testBlueprint2,
        createdOn: new Date(now + 6),
        updatedBy: adminUser,
      });

      testComponent3 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: writeUser2,
        blueprint: testBlueprint3,
        createdOn: new Date(now + 7),
      });

      testComponent4 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: adminUser,
        blueprint: testBlueprint4,
        createdOn: new Date(now + 8),
        blueprintVersionId: testBlueprintVersion.id,
      });
      testComponent4.blueprintVersion = testBlueprintVersion;

      testComponent5 = await testHelper.createTestComponent({
        project: testProject,
        createdBy: adminUser,
        blueprint: testBlueprint4,
        createdOn: new Date(now + 9),
        updatedBy: writeUser2,
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(testUser);
      readerAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/components`);
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
        .get(testHelper.apiRoute('/projects/SomethingWrong/components'))
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
        .get(testHelper.apiRoute(`/projects/${testHelper.generateUUID()}/components`))
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}/components`))
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

    it('should return a paginated list of components', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=2&page=1`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, project, components, ...paginationData } = res.body;
          const expectedComponents = [testComponent5, testComponent4];
          expect(message).toBe('component list has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(paginationData).toEqual({
            page: 1,
            itemsPerPage: 2,
            totalItems: 5,
            totalPages: 3,
          });
          done();
        });
    });

    it('should allow filtering by createdOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=createdOn&filterDateValue=${testComponent2.createdOn.toISOString()}&filterDateOp=lte`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent2, testComponent1];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(2);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by updatedOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=updatedOn&filterDateValue=${testComponent5.updatedOn?.toISOString()}&filterDateOp=gte&orderBy=asc`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent5];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
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
          `${apiRoute}?itemsPerPage=100&filterStringColumn=name&filterStringValue=${testComponent3.name}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent3];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
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
          `${apiRoute}?itemsPerPage=100&filterStringColumn=__createdBy_username&filterStringValue=${writeUser1.displayName}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent2];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by updatedBy username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__updatedBy_username&filterStringValue=${writeUser2.displayName}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent5];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by blueprint name', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__blueprint_name&filterStringValue=${testBlueprint4.name}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent5, testComponent4];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(2);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by blueprint id', (done) => {
      request
        .get(
          `${apiRoute}?filterIdColumn=__blueprint_id&filterIdValue=${testBlueprint4.id}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent5, testComponent4];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(2);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by blueprintVersion name', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__blueprintVersion_name&filterStringValue=${testBlueprintVersion.name}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent4];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow filtering by blueprintVersion id', (done) => {
      request
        .get(
          `${apiRoute}?filterIdColumn=__blueprintVersion_id&filterIdValue=${testBlueprintVersion.id}`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedComponents = [testComponent4];
          expect(components).toEqual(
            expectedComponents.map((expectedComponent) => ({
              id: expectedComponent.id,
              name: expectedComponent.name,
              createdOn: expectedComponent.createdOn.toISOString(),
              createdBy: {
                username: expectedComponent.createdBy.username,
                displayName: expectedComponent.createdBy.displayName,
                createdOn: expectedComponent.createdBy.createdOn.toISOString(),
              },
              updatedOn: expectedComponent.updatedOn?.toISOString() || null,
              updatedBy:
                (expectedComponent.updatedBy && {
                  username: expectedComponent.updatedBy.username,
                  displayName: expectedComponent.updatedBy.displayName,
                  createdOn: expectedComponent.updatedBy.createdOn.toISOString(),
                }) ||
                null,
              blueprint: {
                id: expectedComponent.blueprint.id,
                name: expectedComponent.blueprint.name,
              },
              blueprintVersion: expectedComponent.blueprintVersionId &&
                expectedComponent.blueprintVersion && {
                  id: expectedComponent.blueprintVersion.id,
                  name: expectedComponent.blueprintVersion.name,
                },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(1);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should reject requests if blueprintVersion id is invalid', (done) => {
      request
        .get(`${apiRoute}?filterIdColumn=__blueprintVersion_id&filterIdValue=not-a-uuid`)
        .set('authorization', readerAuthToken)
        .expect(
          422,
          {
            error: 'requested filterIdValue id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests if blueprint id is invalid', (done) => {
      request
        .get(`${apiRoute}?filterIdColumn=__blueprint_id&filterIdValue=not-a-uuid`)
        .set('authorization', readerAuthToken)
        .expect(
          422,
          {
            error: 'requested filterIdValue id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should allow sorting by createdOn in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=10&orderColumn=createdOn&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (components[index + 1]) {
              expect(new Date(component.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(components[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(10);
          done();
        });
    });

    it('should allow sorting by createdOn in descending order', (done) => {
      request
        .get(`${apiRoute}?orderColumn=createdOn&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (components[index + 1]) {
              expect(new Date(component.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(components[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(10);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.updatedOn &&
              components[index + 1] &&
              components[index + 1].updatedOn
            ) {
              expect(new Date(component.updatedOn).getTime()).toBeLessThanOrEqual(
                new Date(components[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.updatedOn &&
              components[index + 1] &&
              components[index + 1].updatedOn
            ) {
              expect(new Date(component.updatedOn).getTime()).toBeGreaterThanOrEqual(
                new Date(components[index + 1].updatedOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (components[index + 1]) {
              expect(
                component.name.toLowerCase() <= components[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (components[index + 1]) {
              expect(
                component.name.toLowerCase() >= components[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.createdBy &&
              components[index + 1] &&
              components[index + 1].createdBy
            ) {
              expect(
                component.createdBy.username.toLowerCase() <=
                  components[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.createdBy &&
              components[index + 1] &&
              components[index + 1].createdBy
            ) {
              expect(
                component.createdBy.username.toLowerCase() >=
                  components[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.updatedBy &&
              components[index + 1] &&
              components[index + 1].updatedBy
            ) {
              expect(
                component.updatedBy.username.toLowerCase() <=
                  components[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
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

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.updatedBy &&
              components[index + 1] &&
              components[index + 1].updatedBy
            ) {
              expect(
                component.updatedBy.username.toLowerCase() >=
                  components[index + 1].updatedBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by blueprint name in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__blueprint_name&orderBy=asc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.blueprint &&
              components[index + 1] &&
              components[index + 1].blueprint
            ) {
              expect(
                component.blueprint.name.toLowerCase() <=
                  components[index + 1].blueprint.name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by blueprint name in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=__blueprint_name&orderBy=desc`)
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component: ComponentData, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.blueprint &&
              components[index + 1] &&
              components[index + 1].blueprint
            ) {
              expect(
                component.blueprint.name.toLowerCase() >=
                  components[index + 1].blueprint.name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by blueprintVersion name in ascending order', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=20&orderColumn=__blueprintVersion_name&orderBy=asc`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.blueprintVersion &&
              components[index + 1] &&
              components[index + 1].blueprintVersion
            ) {
              expect(
                component.blueprintVersion.name.toLowerCase() <=
                  components[index + 1].blueprintVersion.name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by blueprintVersion name in descending order', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=20&orderColumn=__blueprintVersion_name&orderBy=desc`,
        )
        .set('authorization', readerAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { components, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(components)) {
            return done('components is not an array');
          }

          components.forEach((component, index) => {
            if (!component || typeof component !== 'object') {
              return done('component data is not an object');
            }

            if (
              component.blueprintVersion &&
              components[index + 1] &&
              components[index + 1].blueprintVersion
            ) {
              expect(
                component.blueprintVersion.name.toLowerCase() >=
                  components[index + 1].blueprintVersion.name.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(5);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });
  });
});
