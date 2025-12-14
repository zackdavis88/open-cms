/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     AuthenticateAuthTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user successfully authenticated"]
 *         user:
 *           type: object
 *           description: Authenticated user's details
 *           properties:
 *             username:
 *               type: string
 *               description: Unique, lowercase, username for the user
 *               examples: ["johndoe"]
 *             displayName:
 *               type: string
 *               description: Unique, case-sensitive display name for the user
 *               examples: ["JohnDoe"]
 *             createdOn:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the user was created
 *               examples: ["2023-10-05T14:48:00.000Z"]
 *             updatedOn:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the user was last updated
 *               examples: ["2023-11-05T15:00:00.000Z"]
 *           required:
 *             - username
 *             - displayName
 *             - createdOn
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * AUTHENTICATE AUTH TOKEN ENDPOINT        *
 *******************************************/
/**
 * @openapi
 * /api/auth/token:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Authenticate AuthToken
 *     description: Authenticates an authentication token for a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AuthToken successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthenticateAuthTokenResponse"
 *       401:
 *         description: Authentication Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthenticationError"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FatalError"
 */
