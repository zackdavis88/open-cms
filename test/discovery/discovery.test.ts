import { TestHelper } from '../utils';

const testHelper = new TestHelper();
const apiRoute = '/api/discovery';
const request = testHelper.request;

describe('Discovery', () => {
  describe(`GET ${apiRoute}`, () => {
    /*
      Because our swagger specs have generated values for examples, we can no longer
      directly compare the swagger specs anymore. So I have dumbed down the test a bit...

      TODO: Run the swaggerSpec through a validator if possible to ensure its valid OpenAPI specs.
    */
    it('should return OpenAPI specs', async () => {
      const res = await request.get(apiRoute).expect(200);
      const swaggerSpec = res.body;
      expect(swaggerSpec).toBeDefined();
    });
  });
});
