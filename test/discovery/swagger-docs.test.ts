import { TestHelper, swaggerSpec } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/api/discovery/swagger.json';
const request = testHelper.request;

describe('Discovery Swagger JSON', () => {
  describe(`GET ${apiRoute}`, () => {
    it('should return OpenAPI specs', (done) => {
      request.get(apiRoute).expect(200, swaggerSpec, done);
    });
  });
});
