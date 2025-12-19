/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     GetMeResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user successfully authenticated"]
 *         user:
 *           description: Authenticated user details
 *           $ref: "#/components/schemas/UserData"
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * AUTHENTICATE AUTH TOKEN ENDPOINT        *
 *******************************************/
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get Authenticated User Details
 *     description: Returns details of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetMeResponse"
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
