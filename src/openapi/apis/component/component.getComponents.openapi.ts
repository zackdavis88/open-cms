/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetComponentsOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, createdOn, updatedOn, __createdBy_username, __updatedBy_username, __blueprint_name, __blueprintVersion_name]
 *     GetComponentsFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [name, __createdBy_username, __updatedBy_username, __blueprint_name, __blueprintVersion_name]
 *       style: form
 *       explode: true
 *     GetComponentsFilterDateColumnParam:
 *       name: filterDateColumn
 *       description: Date column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [createdOn, updatedOn]
 *     GetComponentsFilterIdColumnParam:
 *       name: filterIdColumn
 *       description: Id column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [__blueprint_id, __blueprintVersion_id]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetComponentsResponse:
 *       description: Component successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested component data
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["component list has been successfully retrieved"]
 *                   project:
 *                     $ref: "#/components/schemas/MinimalProjectData"
 *                   components:
 *                     type: array
 *                     description: Requested component list details
 *                     items:
 *                       allOf:
 *                         - $ref: "#/components/schemas/ComponentData"
 *                         - type: object
 *                           required: ["updatedOn", "updatedBy", "blueprintVersion"]
 *                           properties:
 *                             updatedOn:
 *                               type: ["string", "null"]
 *                               format: date-time
 *                               description: Timestamp of when the component was updated
 *                               examples: ["2025-12-20T15:54:47.862Z", null]
 *                             updatedBy:
 *                               type: ["object", "null"]
 *                               $ref: "#/components/schemas/PublicUserData"
 *                               description: User details of the last update
 *                             blueprintVersion:
 *                               type: ["object", "null"]
 *                               properties:
 *                                 id:
 *                                   type: string
 *                                   format: uuid
 *                                   examples: ["f0c0fb93-ea38-45bc-9267-c42cf0d2c844"]
 *                                 name:
 *                                   type: string
 *                                   examples: ["CoolBlueprint"]
 *                 required:
 *                   - message
 *                   - components
 *                   - project
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET COMPONENTS                          *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/components:
 *   get:
 *     tags:
 *       - Component
 *     summary: Get Component List
 *     description: Gets a pagintated list of components
 *     operationId: getComponentList
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetComponentsOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetComponentsFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetComponentsFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *       - $ref: "#/components/parameters/GetComponentsFilterIdColumnParam"
 *       - $ref: "#/components/parameters/FilterIdValueParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetComponentsResponse"
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
