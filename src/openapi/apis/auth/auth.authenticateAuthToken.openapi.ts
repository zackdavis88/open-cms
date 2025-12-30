/*******************************************
 * RESPONSES                               *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetMeResponse:
 *       description: Authenticated user details response
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Authenticated user details
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["user successfully authenticated"]
 *               user:
 *                 description: Authenticated user data
 *                 $ref: "#/components/schemas/UserData"
 *             required:
 *               - message
 *               - user
 */

/*******************************************
 * GET AUTHENTICATED USER                  *
 *******************************************/
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get Authenticated User Details
 *     description: Returns details of the authenticated user
 *     operationId: getAuthenticatedUser
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetMeResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
