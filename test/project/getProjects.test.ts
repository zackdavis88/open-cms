import { TestHelper, ERROR_TYPES, User, Project, ProjectData } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/projects';
const request = testHelper.request;

describe('Get Projects', () => {
  describe(`GET ${apiRoute}`, () => {
    let testUser: User;
    let testProject: Project;
    let authToken: string;
    const createdOnTimestamp = new Date();
    const updatedOnTimestamp = new Date(Date.now() + 1000 * 60 * 60 * 48);

    beforeAll(async () => {
      const user1 = await testHelper.createTestUser();
      const user2 = await testHelper.createTestUser();
      const user3 = await testHelper.createTestUser();
      testUser = await testHelper.createTestUser();

      authToken = testHelper.generateAuthToken(testUser);

      await testHelper.createTestProject({
        user: user2,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({
        user: user1,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({
        user: user3,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({
        user: user1,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({ user: user1, updatedOn: new Date() });
      await testHelper.createTestProject({ user: user3, updatedOn: new Date() });
      await testHelper.createTestProject({ user: user1, updatedOn: new Date() });
      await testHelper.createTestProject({
        user: user2,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({ user: user2, updatedOn: new Date() });
      await testHelper.createTestProject({ user: user3, updatedOn: new Date() });
      await testHelper.createTestProject({
        user: user1,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      await testHelper.createTestProject({
        user: user2,
        updatedOn: new Date(),
        description: testHelper.generateUUID(),
      });
      testProject = await testHelper.createTestProject({
        user: testUser,
        createdOn: createdOnTimestamp,
        updatedOn: updatedOnTimestamp,
        description: testHelper.generateUUID(),
      });
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

    it('should return a paginated list of projects in descending order of create date', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=5&page=1`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, projects } = res.body;
          expect(message).toBe('project list has been successfully retrieved');
          expect(projects).toBeTruthy();
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(5);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            expect(project.name).toBeTruthy();
            expect(
              project.description === null || typeof project.description === 'string',
            ).toBe(true);
            expect(project.createdOn).toBeTruthy();

            if (projects[index + 1]) {
              expect(new Date(project.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(projects[index + 1].createdOn).getTime(),
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

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (projects[index + 1]) {
              expect(new Date(project.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(projects[index + 1].createdOn).getTime(),
              );
            }
          });

          done();
        });
    });

    it('should allow sorting by descending order of update date', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=updatedOn&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (
              project.updatedOn &&
              projects[index + 1] &&
              projects[index + 1].updatedOn
            ) {
              expect(new Date(project.updatedOn).getTime()).toBeGreaterThanOrEqual(
                new Date(projects[index + 1].updatedOn).getTime(),
              );
            }
          });

          done();
        });
    });

    it('should allow sorting by ascending order of update date', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=UpdatedOn&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (
              project.updatedOn &&
              projects[index + 1] &&
              projects[index + 1].updatedOn
            ) {
              expect(new Date(project.updatedOn).getTime()).toBeLessThanOrEqual(
                new Date(projects[index + 1].updatedOn).getTime(),
              );
            }
          });

          done();
        });
    });

    it('should allow sorting by descending order of name', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=name&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (projects[index + 1]) {
              expect(
                project.name.toLowerCase() >= projects[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow sorting by ascending order of name', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=name&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (projects[index + 1]) {
              expect(
                project.name.toLowerCase() <= projects[index + 1].name.toLowerCase(),
              ).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow sorting by descending order of description', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=description&orderBy=desc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (
              project.description &&
              projects[index + 1] &&
              projects[index + 1].description
            ) {
              expect(
                project.description.toLowerCase() >=
                  projects[index + 1].description.toLowerCase(),
              ).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow sorting by ascending order of description', (done) => {
      request
        .get(`${apiRoute}?page=1&orderColumn=description&orderBy=asc`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(10);
          projects.forEach((project: ProjectData, index) => {
            if (!project || typeof project !== 'object') {
              return done('project data is not an object');
            }

            if (
              project.description &&
              projects[index + 1] &&
              projects[index + 1].description
            ) {
              expect(
                project.description.toLowerCase() <=
                  projects[index + 1].description.toLowerCase(),
              ).toBe(true);
            }
          });

          done();
        });
    });

    it('should allow filtering by name', (done) => {
      request
        .get(`${apiRoute}?filterStringColumn=name&filterStringValue=${testProject.name}`)
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects }: { projects: ProjectData[] } = res.body;
          if (!Array.isArray(projects)) {
            return done('project data is not an array');
          }
          expect(projects.length).toBe(1);
          expect(projects[0]).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedOn: testProject.updatedOn?.toISOString() || null,
            updatedBy: null,
          });
          done();
        });
    });

    it('should allow filtering by description', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=description&filterStringValue=${testProject.description}`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects }: { projects: ProjectData[] } = res.body;
          if (!Array.isArray(projects)) {
            return done('project data is not an array');
          }
          expect(projects.length).toBe(1);
          expect(projects[0]).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedOn: testProject.updatedOn?.toISOString() || null,
            updatedBy: null,
          });
          done();
        });
    });

    it('should allow filtering by createdOn', (done) => {
      request
        .get(
          `${apiRoute}?filterDateColumn=createdOn&filterDateValue=${createdOnTimestamp.toISOString()}&filterDateOp=eq`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects }: { projects: ProjectData[] } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(1);
          expect(projects[0]).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedOn: testProject.updatedOn?.toISOString() || null,
            updatedBy: null,
          });

          done();
        });
    });

    it('should allow filtering by updatedOn', (done) => {
      request
        .get(
          `${apiRoute}?filterDateColumn=updatedOn&filterDateValue=${updatedOnTimestamp.toISOString()}&filterDateOp=gte`,
        )
        .set('authorization', authToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { projects }: { projects: ProjectData[] } = res.body;
          if (!Array.isArray(projects)) {
            return done('projects data is not an array');
          }
          expect(projects.length).toBe(1);
          expect(projects[0]).toEqual({
            id: testProject.id,
            name: testProject.name,
            description: testProject.description,
            createdOn: testProject.createdOn.toISOString(),
            createdBy: {
              username: testUser.username,
              displayName: testUser.displayName,
              createdOn: testUser.createdOn.toISOString(),
            },
            updatedOn: testProject.updatedOn?.toISOString() || null,
            updatedBy: null,
          });

          done();
        });
    });
  });
});
