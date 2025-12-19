/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     GenerateAuthTokenResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user successfully authenticated"]
 *         authToken:
 *           type: string
 *           description: Authentication token for a user
 *           examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0NGMwMGRiLWE5ZGUtNDM1ZC1hYWJmLTg4YTRkNzIzNjEzMCIsImFwaUtleSI6IjIxOWY4MzQ0LTBhNmYtNDIyYi05NWNmLWFjOTczMzQxMGU0NSIsImlhdCI6MTc2NTU5MTUwNCwiZXhwIjoxNzY1NjI3NTA0fQ.Hz1-oPiRvVrV2osqURioXygH-d3q3YJV0D4znnaOY3U"]
 *         user:
 *           description: Authenticated user details
 *           $ref: "#/components/schemas/UserData"
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
 * /api/auth:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Generate AuthToken
 *     description: Generates an authentication token for a user
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: AuthToken successfully generated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GenerateAuthTokenResponse"
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
