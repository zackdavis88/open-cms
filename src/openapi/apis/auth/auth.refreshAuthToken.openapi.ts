/*******************************************
 * RESPONSES                               *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RefreshAuthTokenResponse:
 *       description: AuthToken successfully refreshed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Refreshed authToken response
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["authToken successfully refreshed"]
 *               authToken:
 *                 type: string
 *                 description: Authentication token for a user
 *                 examples: ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE0NGMwMGRiLWE5ZGUtNDM1ZC1hYWJmLTg4YTRkNzIzNjEzMCIsImFwaUtleSI6IjIxOWY4MzQ0LTBhNmYtNDIyYi05NWNmLWFjOTczMzQxMGU0NSIsImlhdCI6MTc2NTU5MTUwNCwiZXhwIjoxNzY1NjI3NTA0fQ.Hz1-oPiRvVrV2osqURioXygH-d3q3YJV0D4znnaOY3U"]
 *               user:
 *                 description: Authenticated user details
 *                 $ref: "#/components/schemas/UserData"
 *             required:
 *               - message
 *               - authToken
 *               - user
 */

/*******************************************
 * REFRESH AUTH TOKEN                      *
 *******************************************/
/**
 * @openapi
 * /auth/refresh:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Refresh AuthToken
 *     description: Refreshes an authentication token for a user
 *     operationId: refreshAuthToken
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RefreshAuthTokenResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
