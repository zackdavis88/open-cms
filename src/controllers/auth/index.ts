import { default as generateAuthToken } from './generateAuthToken';
import { default as refreshAuthToken } from './refreshAuthToken';
import {
  default as authenticateAuthToken,
  authenticateAuthTokenMiddleware,
} from './authenticateAuthToken';

export default {
  generateAuthToken,
  refreshAuthToken,
  authenticateAuthToken,
  authenticateAuthTokenMiddleware,
};
