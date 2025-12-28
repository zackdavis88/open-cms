/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateBlueprintBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new blueprint
 *                 examples: ["SuperCoolBlueprint"]
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
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateBlueprintResponse:
 *       description: Blueprint successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New blueprint data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["blueprint has been successfully created"]
 *               blueprint:
 *                 description: Created blueprint details
 *                 allOf:
 *                   - $ref: "#/components/schemas/BlueprintData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                     required:
 *                       - project
 *             required:
 *               - message
 *               - blueprint
 */

/*******************************************
 * CREATE BLUEPRINT                        *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/blueprints:
 *   post:
 *     tags:
 *       - Blueprint
 *     summary: Create Blueprint
 *     description: Creates a new blueprint
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateBlueprintBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateBlueprintResponse"
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
