import 'express-serve-static-core'; // Required for declaration merging

declare module 'express-serve-static-core' {
  interface Response {
    success: (message: string, data?: Record<string, unknown>) => Response | undefined;
    sendError: (error: unknown) => Response | undefined;
  }
}
