/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetLayoutsOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, createdOn, updatedOn, __createdBy_username, __updatedBy_username]
 *     GetLayoutsFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, __createdBy_username, __updatedBy_username]
 *       style: form
 *       explode: true
 *     GetLayoutsFilterDateColumnParam:
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
 *     GetLayoutsResponse:
 *       description: Layout list successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested layout list data
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["layout list has been successfully retrieved"]
 *                   project:
 *                     $ref: "#/components/schemas/MinimalProjectData"
 *                   layouts:
 *                     type: array
 *                     description: Requested layout list details
 *                     items:
 *                       allOf:
 *                         - $ref: "#/components/schemas/LayoutData"
 *                         - type: object
 *                           required: ["updatedOn", "updatedBy"]
 *                           properties:
 *                             updatedOn:
 *                               type: ["string", "null"]
 *                               format: date-time
 *                               description: Timestamp of when the layout was updated
 *                               examples: ["2025-12-20T15:54:47.862Z", null]
 *                             updatedBy:
 *                               type: ["object", "null"]
 *                               $ref: "#/components/schemas/PublicUserData"
 *                               description: User details of the last update
 *                 required:
 *                   - message
 *                   - layouts
 *                   - project
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET LAYOUTS                             *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/layouts:
 *   get:
 *     tags:
 *       - Layout
 *     summary: Get Layout List
 *     description: Gets a pagintated list of layouts
 *     operationId: getLayoutList
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetLayoutsOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetLayoutsFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetLayoutsFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetLayoutsResponse"
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
