import 'express-serve-static-core'; // Required for declaration merging
import { Sequelize } from 'sequelize';

declare module 'express-serve-static-core' {
  interface Request {
    sequelize: Sequelize;
  }
  interface Response {
    success: (message: string, data?: Record<string, unknown>) => Response | undefined;
    sendError: (error: unknown) => Response | undefined;
  }
}
