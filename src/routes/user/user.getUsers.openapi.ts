/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     GetUsersOrderColumnParam:
 *       allOf:
 *         - $ref: "#/components/schemas/OrderColumnParam"
 *         - schema:
 *             type: string
 *             enum:
 *               - username
 *               - createdOn
 *     GetUsersFilterStringColumnParam:
 *       allOf:
 *         - $ref: "#/components/schemas/FilterStringColumnParam"
 *         - schema:
 *             type: string
 *             enum:
 *               - username
 *     GetUsersFilterDateColumnParam:
 *       allOf:
 *         - $ref: "#/components/schemas/FilterDateColumnParam"
 *         - schema:
 *             type: string
 *             enum:
 *               - createdOn
 *     GetUsersResponse:
 *       allOf:
 *         - type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Successful message
 *               examples: ["user list has been successfully retrieved"]
 *             users:
 *               type: array
 *               description: A list of users
 *               items:
 *                 $ref: "#/components/schemas/PublicUserData"
 *           required:
 *             - message
 *             - users
 *         - $ref: "#/components/schemas/PaginationData"
 *
 */

/*******************************************
 * GET USERS ENDPOINT                       *
 *******************************************/
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - $ref: "#/components/schemas/PageParam"
 *       - $ref: "#/components/schemas/ItemsPerPageParam"
 *       - $ref: "#/components/schemas/GetUsersOrderColumnParam"
 *       - $ref: "#/components/schemas/OrderByParam"
 *       - $ref: "#/components/schemas/GetUsersFilterStringColumnParam"
 *       - $ref: "#/components/schemas/FilterStringValueParam"
 *       - $ref: "#/components/schemas/GetUsersFilterDateColumnParam"
 *       - $ref: "#/components/schemas/FilterDateValueParam"
 *       - $ref: "#/components/schemas/FilterDateOpParam"
 *     summary: Get User List
 *     description: Gets a pagintated list of users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GetUsersResponse"
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
