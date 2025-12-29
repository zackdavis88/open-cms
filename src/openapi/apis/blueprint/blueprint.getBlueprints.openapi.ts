/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetBlueprintsOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, createdOn, updatedOn, __createdBy_username, __updatedBy_username]
 *     GetBlueprintsFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, __createdBy_username, __updatedBy_username]
 *       style: form
 *       explode: true
 *     GetBlueprintsFilterDateColumnParam:
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
 *     GetBlueprintsResponse:
 *       description: Blueprint successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested blueprint data
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["blueprint list has been successfully retrieved"]
 *                   project:
 *                     $ref: "#/components/schemas/MinimalProjectData"
 *                   blueprints:
 *                     type: array
 *                     description: Requested blueprint details
 *                     items:
 *                       allOf:
 *                         - $ref: "#/components/schemas/MinimalBlueprintData"
 *                         - type: object
 *                           required: ["updatedOn", "updatedBy"]
 *                           properties:
 *                             updatedOn:
 *                               type: ["string", "null"]
 *                               format: date-time
 *                               description: Timestamp of when the blueprint was updated
 *                               examples: ["2025-12-20T15:54:47.862Z", null]
 *                             updatedBy:
 *                               type: ["object", "null"]
 *                               $ref: "#/components/schemas/PublicUserData"
 *                               description: User details of the last update
 *                 required:
 *                   - message
 *                   - blueprints
 *                   - project
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET BLUEPRINTS                          *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/blueprints:
 *   get:
 *     tags:
 *       - Blueprint
 *     summary: Get Blueprint List
 *     description: Gets a pagintated list of blueprints
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetBlueprintsOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetBlueprintsFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetBlueprintsFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetBlueprintsResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       403:
 *         $ref: "#/components/responses/AuthorizationError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
