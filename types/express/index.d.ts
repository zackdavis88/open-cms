import 'express-serve-static-core'; // Required for declaration merging
import { Sequelize } from 'sequelize';
import { User } from 'src/models';

declare module 'express-serve-static-core' {
  interface Request {
    sequelize: Sequelize;
    user: User;
  }
  interface Response {
    success: (message: string, data?: Record<string, unknown>) => Response | undefined;
    sendError: (error: unknown) => Response | undefined;
  }
}
