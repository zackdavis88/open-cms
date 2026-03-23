import { TestHelper, ERROR_TYPES, User, Project, Image, ImageData } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/images');
const request = testHelper.request;

describe('Get Images', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let nonMemberUser: User;
    let readAuthToken: string;
    let nonMemberAuthToken: string;
    let testProject: Project;
    let deletedProject: Project;
    let testImage1: Image;
    let testImage2: Image;
    let testImage3: Image;
    let testImage4: Image;
    let testImage5: Image;
    let testImage6: Image;
    let testImage7: Image;
    let testImage8: Image;
    let testImage9: Image;
    let testImage10: Image;
    let testImage11: Image;
    let testImage12: Image;
    let testImage13: Image;
    let testImage14: Image;

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

      testImage1 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 1),
        extension: '.gif',
      });
      testImage2 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 2),
        extension: '.gif',
      });
      testImage3 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 3),
        extension: '.gif',
      });
      testImage4 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 4),
      });
      testImage5 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 5),
      });
      testImage6 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 6),
      });
      testImage7 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 7),
      });
      testImage8 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 8),
      });
      testImage9 = await testHelper.createTestImage({
        project: testProject,
        createdBy: readUser,
        createdOn: new Date(now + 9),
      });
      testImage10 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 10),
      });
      testImage11 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 11),
      });
      testImage12 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 12),
      });
      testImage13 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 13),
      });
      testImage14 = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 14),
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(nonMemberUser);
      readAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/images`);
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
        .get(testHelper.apiRoute('/projects/SomethingWrong/images'))
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
        .get(testHelper.apiRoute(`/projects/${crypto.randomUUID()}/images`))
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}/images`))
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

    it('should return a paginated list of images', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=4&page=1`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { message, project, images, ...paginationData } = res.body;
          const expectedImages = [testImage14, testImage13, testImage12, testImage11];
          expect(message).toBe('image list has been successfully retrieved');
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(images).toEqual(
            expectedImages.map((expectedImage) => {
              return {
                id: expectedImage.id,
                originalFileName: expectedImage.originalFileName,
                extension: expectedImage.extension,
                url: `http://localhost:3000/static/${testProject.id}/${expectedImage.id}${expectedImage.extension}`,
                createdOn: expectedImage.createdOn.toISOString(),
                createdBy: {
                  username: expectedImage.createdBy.username,
                  displayName: expectedImage.createdBy.displayName,
                  createdOn: expectedImage.createdBy.createdOn.toISOString(),
                },
              };
            }),
          );
          expect(paginationData).toEqual({
            page: 1,
            itemsPerPage: 4,
            totalItems: 14,
            totalPages: 4,
          });
          done();
        });
    });

    it('should allow filtering by createdOn date', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=5&filterDateColumn=createdOn&filterDateValue=${testImage10.createdOn.toISOString()}&filterDateOp=lt`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedImages = [
            testImage9,
            testImage8,
            testImage7,
            testImage6,
            testImage5,
          ];
          expect(images).toEqual(
            expectedImages.map((expectedImage) => ({
              id: expectedImage.id,
              originalFileName: expectedImage.originalFileName,
              extension: expectedImage.extension,
              createdOn: expectedImage.createdOn.toISOString(),
              url: `http://localhost:3000/static/${testProject.id}/${expectedImage.id}${expectedImage.extension}`,
              createdBy: {
                username: expectedImage.createdBy.username,
                displayName: expectedImage.createdBy.displayName,
                createdOn: expectedImage.createdBy.createdOn.toISOString(),
              },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(2);
          expect(totalItems).toBe(9);
          expect(itemsPerPage).toBe(5);
          done();
        });
    });

    it('should allow filtering by original filename', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterStringColumn=originalFileName&filterStringValue=${testImage4.originalFileName}`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedImages = [testImage4];
          expect(images).toEqual(
            expectedImages.map((expectedImage) => ({
              id: expectedImage.id,
              originalFileName: expectedImage.originalFileName,
              extension: expectedImage.extension,
              url: `http://localhost:3000/static/${testProject.id}/${expectedImage.id}${expectedImage.extension}`,
              createdOn: expectedImage.createdOn.toISOString(),
              createdBy: {
                username: expectedImage.createdBy.username,
                displayName: expectedImage.createdBy.displayName,
                createdOn: expectedImage.createdBy.createdOn.toISOString(),
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

    it('should allow filtering by extension', (done) => {
      request
        .get(
          `${apiRoute}?itemsPerPage=100&filterStringColumn=extension&filterStringValue=.gif`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedImages = [testImage3, testImage2, testImage1];
          expect(images).toEqual(
            expectedImages.map((expectedImage) => ({
              id: expectedImage.id,
              originalFileName: expectedImage.originalFileName,
              extension: expectedImage.extension,
              url: `http://localhost:3000/static/${testProject.id}/${expectedImage.id}${expectedImage.extension}`,
              createdOn: expectedImage.createdOn.toISOString(),
              createdBy: {
                username: expectedImage.createdBy.username,
                displayName: expectedImage.createdBy.displayName,
                createdOn: expectedImage.createdBy.createdOn.toISOString(),
              },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(3);
          expect(itemsPerPage).toBe(100);
          done();
        });
    });

    it('should allow filtering by createdBy username', (done) => {
      request
        .get(
          `${apiRoute}?filterStringColumn=__createdBy_username&filterStringValue=${readUser.username}&orderBy=asc`,
        )
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          const expectedImages = [
            testImage3,
            testImage4,
            testImage5,
            testImage6,
            testImage7,
            testImage8,
            testImage9,
          ];
          expect(images).toEqual(
            expectedImages.map((expectedImage) => ({
              id: expectedImage.id,
              originalFileName: expectedImage.originalFileName,
              extension: expectedImage.extension,
              url: `http://localhost:3000/static/${testProject.id}/${expectedImage.id}${expectedImage.extension}`,
              createdOn: expectedImage.createdOn.toISOString(),
              createdBy: {
                username: expectedImage.createdBy.username,
                displayName: expectedImage.createdBy.displayName,
                createdOn: expectedImage.createdBy.createdOn.toISOString(),
              },
            })),
          );
          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(7);
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

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(new Date(image.createdOn).getTime()).toBeLessThanOrEqual(
                new Date(images[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
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

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(new Date(image.createdOn).getTime()).toBeGreaterThanOrEqual(
                new Date(images[index + 1].createdOn).getTime(),
              );
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(18);
          done();
        });
    });

    it('should allow sorting by original filename in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=originalFileName&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(
                image.originalFileName.toLowerCase() <=
                  images[index + 1].originalFileName.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by original filename in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=originalFileName&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(
                image.originalFileName.toLowerCase() >=
                  images[index + 1].originalFileName.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by extension in ascending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=extension&orderBy=asc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(
                image.extension.toLowerCase() <=
                  images[index + 1].extension.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });

    it('should allow sorting by extension in descending order', (done) => {
      request
        .get(`${apiRoute}?itemsPerPage=20&orderColumn=extension&orderBy=desc`)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (images[index + 1]) {
              expect(
                image.extension.toLowerCase() >=
                  images[index + 1].extension.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
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

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (image.createdBy && images[index + 1] && images[index + 1].createdBy) {
              expect(
                image.createdBy.username.toLowerCase() <=
                  images[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
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

          const { images, page, itemsPerPage, totalItems, totalPages } = res.body;
          if (!Array.isArray(images)) {
            return done('images is not an array');
          }

          images.forEach((image: ImageData, index) => {
            if (!image || typeof image !== 'object') {
              return done('image data is not an object');
            }

            if (image.createdBy && images[index + 1] && images[index + 1].createdBy) {
              expect(
                image.createdBy.username.toLowerCase() >=
                  images[index + 1].createdBy.username.toLowerCase(),
              ).toBe(true);
            }
          });

          expect(page).toBe(1);
          expect(totalPages).toBe(1);
          expect(totalItems).toBe(14);
          expect(itemsPerPage).toBe(20);
          done();
        });
    });
  });
});
