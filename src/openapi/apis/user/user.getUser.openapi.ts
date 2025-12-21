/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetUserResponse:
 *       description: User retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested user data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["user has been successfully retrieved"]
 *               user:
 *                 description: Requested user details
 *                 $ref: "#/components/schemas/PublicUserData"
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * GET USER                                *
 *******************************************/
/**
 * @openapi
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - $ref: "#/components/parameters/UsernameParam"
 *     summary: Get User Details
 *     description: Gets user data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetUserResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
