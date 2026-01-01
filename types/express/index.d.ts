import 'express-serve-static-core'; // Required for declaration merging
import { Sequelize } from 'sequelize';
import { User, Project, Membership, Blueprint, Component } from 'src/models';

declare module 'express-serve-static-core' {
  interface Request {
    sequelize: Sequelize;
    user: User;
    project: Project;
    membership: Membership;
    blueprint: Blueprint;
    component: Component;
  }
  interface Response {
    success: (message: string, data?: Record<string, unknown>) => Response | undefined;
    sendError: (error: unknown) => Response | undefined;
  }
}
