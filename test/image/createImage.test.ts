import { ERROR_TYPES, Project, TestHelper, User, Image } from '../utils';
import path from 'path';
const testHelper = new TestHelper();
let apiRoute = testHelper.apiRoute('/projects/:projectId/images');
const request = testHelper.request;

describe('Create Image', () => {
  describe(`POST ${apiRoute}`, () => {
    let adminUser: User;
    let readUser: User;
    let nonMemberUser: User;
    let adminAuthToken: string;
    let readAuthToken: string;
    let nonMemberAuthToken: string;
    let testProject: Project;
    let deletedProject: Project;

    beforeAll(async () => {
      adminUser = await testHelper.createTestUser();
      adminAuthToken = testHelper.generateAuthToken(adminUser);
      readUser = await testHelper.createTestUser();
      readAuthToken = testHelper.generateAuthToken(readUser);
      nonMemberUser = await testHelper.createTestUser();
      nonMemberAuthToken = testHelper.generateAuthToken(nonMemberUser);
      deletedProject = await testHelper.createTestProject({
        user: adminUser,
        isActive: false,
      });
      testProject = await testHelper.createTestProject({ user: adminUser });
      await testHelper.createTestMembership({
        project: testProject,
        user: readUser,
        createdBy: adminUser,
      });
    });

    beforeEach(() => {
      apiRoute = testHelper.apiRoute(`/projects/${testProject.id}/images`);
    });

    afterAll(async () => {
      await testHelper.removeTestData({ removeStaticFiles: true });
    });

    it('should require authentication', (done) => {
      request.post(apiRoute).expect(
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
        .post(testHelper.apiRoute('/projects/SomethingWrong/images'))
        .set('authorization', adminAuthToken)
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
        .post(testHelper.apiRoute(`/projects/${crypto.randomUUID()}/images`))
        .set('authorization', adminAuthToken)
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
        .post(testHelper.apiRoute(`/projects/${deletedProject.id}/images`))
        .set('authorization', adminAuthToken)
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
      request.post(apiRoute).set('authorization', nonMemberAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    it('should reject requests when the user does not have write permissions', (done) => {
      request.post(apiRoute).set('authorization', readAuthToken).expect(
        403,
        {
          error: 'you do not have permissions to perform this action',
          errorType: ERROR_TYPES.AUTHORIZATION,
        },
        done,
      );
    });

    // These tests will pass assuming the following .env config:
    /*
     *   MAX_FILE_COUNT=5
     *   MAX_FILE_SIZE=5242880
     *   MAX_FILENAME_LENGTH=100
     */
    it('should reject requests when the user uploads more than the MAX_FILE_COUNT', (done) => {
      const filePath = path.resolve(__dirname, '../utils/files/smart.webp');
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .attach('images', filePath)
        .attach('images', filePath)
        .attach('images', filePath)
        .attach('images', filePath)
        .attach('images', filePath)
        .attach('images', filePath)
        .expect(
          422,
          {
            error: 'cannot upload more than 5 files',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when the user uploads a file with name more than MAX_FILENAME_LENGTH', (done) => {
      const tooLongFilePath = path.resolve(
        __dirname,
        '../utils/files/this-name-is-long-this-name-is-long-this-name-is-long-this-name-is-long-this-name-is-long-this-name-is-long.jpeg',
      );
      const filePath = path.resolve(__dirname, '../utils/files/smart.webp');
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .attach('images', tooLongFilePath)
        .attach('images', filePath)
        .expect(
          422,
          {
            error: 'filename must be 100 characters or less',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when the user uploads an unsupported file', (done) => {
      const unsupportedFilePath = path.resolve(__dirname, '../utils/files/text-file.txt');
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .attach('images', unsupportedFilePath)
        .expect(
          422,
          {
            error: 'image files must be jpeg|jpg|png|webp|gif',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should reject requests when the user uploads a file larger than MAX_FILE_SIZE', (done) => {
      const tooLargeFilePath = path.resolve(__dirname, '../utils/files/large.jpg');
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .attach('images', tooLargeFilePath)
        .expect(
          422,
          {
            error: 'file size cannot be larger than 5242880 bytes',
            errorType: ERROR_TYPES.VALIDATION,
          },
          done,
        );
    });

    it('should successfully upload images', (done) => {
      const imagePath1 = path.resolve(__dirname, '../utils/files/nene-painting.gif');
      const imagePath2 = path.resolve(__dirname, '../utils/files/smart.webp');
      const expectData = [
        {
          originalFileName: 'nene-painting',
          extension: '.gif',
        },
        {
          originalFileName: 'smart',
          extension: '.webp',
        },
      ];
      request
        .post(apiRoute)
        .set('authorization', adminAuthToken)
        .attach('images', imagePath1)
        .attach('images', imagePath2)
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          const { message, images, project, createdBy } = res.body;
          expect(project).toEqual({
            id: testProject.id,
            name: testProject.name,
          });
          expect(createdBy).toEqual({
            username: adminUser.username,
            displayName: adminUser.displayName,
            createdOn: adminUser.createdOn.toISOString(),
          });
          expect(message).toBe('images successfully uploaded');
          expect(Array.isArray(images)).toBe(true);
          images.forEach((image: Image & { url: string }, index: number) => {
            expect(image.id).toBeDefined();
            expect(image.url).toBeDefined();
            expect(image.originalFileName).toBe(expectData[index].originalFileName);
            expect(image.extension).toBe(expectData[index].extension);
            expect(image.createdOn).toBeDefined();
          });
          done();
        });
    });
  });
});
