/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetMembershipsOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [
 *           createdOn,
 *           updatedOn,
 *           __user_username,
 *           __createdBy_username,
 *           __updatedBy_username,
 *           isAdmin,
 *           isWriter
 *         ]
 *     GetMembershipsFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [
 *           __user_username,
 *           __createdBy_username,
 *           __updatedBy_username
 *         ]
 *       style: form
 *       explode: true
 *     GetMembershipsFilterDateColumnParam:
 *       name: filterDateColumn
 *       description: Date column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [createdOn, updatedOn]
 *     GetMembershipsFilterBooleanColumnParam:
 *       name: filterBooleanColumn
 *       description: Boolean column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [isAdmin, isWriter]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetMembershipsResponse:
 *       description: Membership list retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested membership list data
 *                 required:
 *                   - message
 *                   - project
 *                   - memberships
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["membership list has been successfully retrieved"]
 *                   project:
 *                     $ref: "#/components/schemas/MinimalProjectData"
 *                   memberships:
 *                     description: Paginated list of project memberships
 *                     type: array
 *                     items:
 *                       allOf:
 *                         - $ref: "#/components/schemas/MembershipData"
 *                         - type: object
 *                           required: ["updatedOn", "updatedBy"]
 *                           properties:
 *                             updatedOn:
 *                               type: ["string", "null"]
 *                               format: date-time
 *                               description: Timestamp of when the membership was updated
 *                               examples: ["2025-12-31T15:00:47.862Z", null]
 *                             updatedBy:
 *                               type: ["object", "null"]
 *                               $ref: "#/components/schemas/PublicUserData"
 *                               description: User details of the last update
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET MEMBERSHIPS                         *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/memberships:
 *   get:
 *     tags:
 *       - Membership
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetMembershipsOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetMembershipsFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetMembershipsFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *       - $ref: "#/components/parameters/GetMembershipsFilterBooleanColumnParam"
 *       - $ref: "#/components/parameters/FilterBooleanValueParam"
 *     summary: Get Membership List
 *     description: Gets a pagintated list of memberships for a project
 *     operationId: getMembershipList
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetMembershipsResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
