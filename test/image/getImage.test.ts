import { TestHelper, ERROR_TYPES, User, Project, Image } from '../utils';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/images/:imageId');
const request = testHelper.request;

describe('Get Image', () => {
  describe(`GET ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let nonMemberUser: User;
    let readAuthToken: string;
    let nonMemberAuthToken: string;
    let testProject: Project;
    let deletedProject: Project;
    let testImage: Image;
    let deletedImage: Image;

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

      testImage = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 1),
        extension: '.jpeg',
      });
      deletedImage = await testHelper.createTestImage({
        project: testProject,
        createdBy: adminUser,
        createdOn: new Date(now + 2),
        extension: '.gif',
        isActive: false,
      });
    });

    beforeEach(() => {
      nonMemberAuthToken = testHelper.generateAuthToken(nonMemberUser);
      readAuthToken = testHelper.generateAuthToken(readUser);
      apiRoute = testHelper.apiRoute(
        `/projects/${testProject.id}/images/${testImage.id}`,
      );
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
        .get(testHelper.apiRoute(`/projects/NotAValidId/images/${testImage.id}`))
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
        .get(
          testHelper.apiRoute(`/projects/${crypto.randomUUID()}/images/${testImage.id}`),
        )
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
        .get(testHelper.apiRoute(`/projects/${deletedProject.id}/images/${testImage.id}`))
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

    it('should reject when image id is not a valid uuid', (done) => {
      request
        .get(testHelper.apiRoute(`/projects/${testProject.id}/images/ThisIsNotRight`))
        .set('authorization', readAuthToken)
        .expect(
          422,
          {
            error: 'requested image id is not valid',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject when image is not found', (done) => {
      request
        .get(
          testHelper.apiRoute(
            `/projects/${testProject.id}/images/${crypto.randomUUID()}`,
          ),
        )
        .set('authorization', readAuthToken)
        .expect(
          404,
          {
            error: 'requested image not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should reject when image is deleted', (done) => {
      request
        .get(testHelper.apiRoute(`/projects/${testProject.id}/images/${deletedImage.id}`))
        .set('authorization', readAuthToken)
        .expect(
          404,
          {
            error: 'requested image not found',
            errorType: ERROR_TYPES.NOT_FOUND,
          },
          done,
        );
    });

    it('should successfully retrieve an image', (done) => {
      request
        .get(apiRoute)
        .set('authorization', readAuthToken)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { message, image } = res.body;
          expect(message).toBe('image has been successfully retrieved');
          expect(image).toEqual({
            id: testImage.id,
            originalFileName: testImage.originalFileName,
            extension: testImage.extension,
            url: `http://localhost:3000/static/${testProject.id}/${testImage.id}${testImage.extension}`,
            project: {
              id: testProject.id,
              name: testProject.name,
            },
            createdOn: testImage.createdOn.toISOString(),
            createdBy: {
              username: adminUser.username,
              displayName: adminUser.displayName,
              createdOn: adminUser.createdOn.toISOString(),
            },
          });
          done();
        });
    });
  });
});
