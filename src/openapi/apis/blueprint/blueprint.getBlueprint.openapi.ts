/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetBlueprintResponse:
 *       description: Blueprint successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested blueprint data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["blueprint has been successfully retrieved"]
 *               blueprint:
 *                 description: Requested blueprint details
 *                 allOf:
 *                   - $ref: "#/components/schemas/BlueprintData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the blueprint was updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                     required:
 *                       - project
 *                       - updatedOn
 *                       - updatedBy
 *             required:
 *               - message
 *               - blueprint
 */

/*******************************************
 * GET BLUEPRINT                           *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/blueprints/{blueprintId}:
 *   get:
 *     tags:
 *       - Blueprint
 *     summary: Get Blueprint Details
 *     description: Gets blueprint data based on the unique id of the project/blueprint
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/BlueprintIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetBlueprintResponse"
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
