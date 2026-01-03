import { TestHelper, ERROR_TYPES } from '../utils';
const testHelper = new TestHelper();
const apiRoute = '/somethingThatDoesntExist';
const request = testHelper.request;

describe('Catch All Route', () => {
  describe(`ALL ${apiRoute}`, () => {
    it('should reject requests for routes that do not exist', (done) => {
      request.get(apiRoute).expect(
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
