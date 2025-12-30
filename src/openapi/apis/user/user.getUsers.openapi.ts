/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetUsersOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [username, createdOn]
 *     GetUsersFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [username]
 *       style: form
 *       explode: true
 *     GetUsersFilterDateColumnParam:
 *       name: filterDateColumn
 *       description: Date column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [createdOn]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetUsersResponse:
 *       description: User list retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested user list data
 *                 required: ["message", "users"]
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["user list has been successfully retrieved"]
 *                   users:
 *                     description: Paginated list of users
 *                     type: array
 *                     items:
 *                       $ref: "#/components/schemas/PublicUserData"
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET USERS                               *
 *******************************************/
/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - User
 *     parameters:
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetUsersOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetUsersFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetUsersFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *     summary: Get User List
 *     description: Gets a pagintated list of users
 *     operationId: getUserList
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetUsersResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
