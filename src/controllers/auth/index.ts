import { default as generateAuthToken } from './generateAuthToken';
import { default as refreshAuthToken } from './refreshAuthToken';
import { default as getMe, authenticateAuthToken } from './authenticateAuthToken';

export default {
  generateAuthToken,
  refreshAuthToken,
  authenticateAuthToken,
  getMe,
};
