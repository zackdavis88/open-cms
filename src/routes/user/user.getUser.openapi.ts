/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     GetUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user has been successfully retrieved"]
 *         user:
 *           description: Requested user details
 *           $ref: "#/components/schemas/PublicUserData"
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * GET USER ENDPOINT                       *
 *******************************************/
/**
 * @openapi
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Case insensitive username of a user
 *     summary: Get User Details
 *     description: Gets user data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetUserResponse"
 *       401:
 *         description: Authentication Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthenticationError"
 *       404:
 *         description: Not Found Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFoundError"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FatalError"
 */
