/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdateBlueprintBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the blueprint
 *                 examples: ["UpdatedBlueprint"]
 *               fields:
 *                 type: array
 *                 description: Array of blueprint fields that describe your component shape
 *                 items:
 *                   anyOf:
 *                     - $ref: "#/components/schemas/BlueprintStringField"
 *                     - $ref: "#/components/schemas/BlueprintNumberField"
 *                     - $ref: "#/components/schemas/BlueprintBooleanField"
 *                     - $ref: "#/components/schemas/BlueprintDateField"
 *                     - $ref: "#/components/schemas/BlueprintArrayField"
 *                     - $ref: "#/components/schemas/BlueprintObjectField"
 *                 examples: [[{"name": "stringField1", "type": "string"}, {"name": "arrayField1", "type": "array", "arrayOf": {"name": "arrayItem", "type": "number", "isInteger": true}}]]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdateBlueprintResponse:
 *       description: Blueprint successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated blueprint data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["blueprint has been successfully updated"]
 *               blueprint:
 *                 description: Updated blueprint details
 *                 allOf:
 *                   - $ref: "#/components/schemas/BlueprintData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: "string"
 *                         format: date-time
 *                         description: Timestamp of when the blueprint was updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: "object"
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
 * UPDATE BLUEPRINT                        *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/blueprints/{blueprintId}:
 *   patch:
 *     tags:
 *       - Blueprint
 *     summary: Update Blueprint
 *     description: Updates a blueprint
 *     operationId: updateBlueprint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateBlueprintBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/BlueprintIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdateBlueprintResponse"
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
