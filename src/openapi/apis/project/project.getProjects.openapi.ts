/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetProjectsOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, description, createdOn, updatedOn]
 *     GetProjectsFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, description]
 *       style: form
 *       explode: true
 *     GetProjectsFilterDateColumnParam:
 *       name: filterDateColumn
 *       description: Date column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [createdOn, updatedOn]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetProjectsResponse:
 *       description: Project list retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested project list data
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["project list has been successfully retrieved"]
 *                   projects:
 *                     description: Paginated list of projects
 *                     type: array
 *                     items:
 *                       allOf:
 *                         - $ref: "#/components/schemas/ProjectData"
 *                         - type: object
 *                           properties:
 *                             updatedOn:
 *                               type: ["string", "null"]
 *                               format: date-time
 *                               description: Timestamp of when the project was updated
 *                               examples: ["2025-12-20T15:54:47.862Z", null]
 *                             updatedBy:
 *                               type: ["object", "null"]
 *                               $ref: "#/components/schemas/PublicUserData"
 *                               description: User details of the last update
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET PROJECTS                            *
 *******************************************/
/**
 * @openapi
 * /api/projects:
 *   get:
 *     tags:
 *       - Project
 *     parameters:
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetProjectsOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetProjectsFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetProjectsFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *     summary: Get Project List
 *     description: Gets a pagintated list of projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetProjectsResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
