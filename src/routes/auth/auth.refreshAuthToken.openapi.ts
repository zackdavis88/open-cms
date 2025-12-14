/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     RefreshAuthTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["authToken successfully refreshed"]
 *         authToken:
 *           type: string
 *           description: Authentication token for a user
 *           examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0NGMwMGRiLWE5ZGUtNDM1ZC1hYWJmLTg4YTRkNzIzNjEzMCIsImFwaUtleSI6IjIxOWY4MzQ0LTBhNmYtNDIyYi05NWNmLWFjOTczMzQxMGU0NSIsImlhdCI6MTc2NTU5MTUwNCwiZXhwIjoxNzY1NjI3NTA0fQ.Hz1-oPiRvVrV2osqURioXygH-d3q3YJV0D4znnaOY3U"]
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
 *         - authToken
 */

/*******************************************
 * GENERATE AUTH TOKEN ENDPOINT            *
 *******************************************/
/**
 * @openapi
 * /api/auth/refresh:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Refresh AuthToken
 *     description: Refreshes an authentication token for a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: AuthToken successfully refreshed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RefreshAuthTokenResponse"
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
