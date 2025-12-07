import { TestHelper, request, ERROR_TYPES } from '../utils';
const testHelper = new TestHelper();
const serverUrl = testHelper.getServerUrl();
const apiRoute = '/somethingThatDoesntExist';

describe('Catch All Route', () => {
  describe(`ALL ${apiRoute}`, () => {
    it('should reject requests for routes that do not exist', (done) => {
      request(serverUrl).get(apiRoute).expect(
        404,
        {
          error: 'API route not found',
          errorType: ERROR_TYPES.NOT_FOUND,
        },
        done,
      );
    });
  });
});
