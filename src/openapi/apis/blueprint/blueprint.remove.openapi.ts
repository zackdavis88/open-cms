/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveBlueprintBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["confirm"]
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Case-sensitive name of the blueprint
 *                 examples: ["SuperCoolBlueprint"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveBlueprintResponse:
 *       description: Blueprint successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted blueprint data
 *             required: ["message", "blueprint"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["blueprint has been successfully removed"]
 *               blueprint:
 *                 description: Deleted blueprint details
 *                 allOf:
 *                   - $ref: "#/components/schemas/BlueprintData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the blueprint was last updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       deletedOn:
 *                         type: "string"
 *                         format: date-time
 *                         description: Timestamp of when the blueprint was deleted
 *                         examples: ["2026-01-20T15:54:47.862Z"]
 *                       deletedBy:
 *                         type: "object"
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the deletion
 *                     required:
 *                       - project
 *                       - updatedOn
 *                       - updatedBy
 *                       - deletedOn
 *                       - deletedBy
 */

/*******************************************
 * REMOVE BLUEPRINT                        *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/blueprints/{blueprintId}:
 *   delete:
 *     tags:
 *       - Blueprint
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/BlueprintIdParam"
 *     summary: Delete Blueprint
 *     description: Deletes a blueprint
 *     operationId: removeBlueprint
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveBlueprintBody"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveBlueprintResponse"
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
