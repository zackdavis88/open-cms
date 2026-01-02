/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetComponentResponse:
 *       description: Component successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested component data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["component has been successfully retrieved"]
 *               component:
 *                 description: Requested component details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ComponentData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the component was updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       blueprintVersion:
 *                         type: ["object", "null"]
 *                         examples: ["null"]
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                             examples: ["f0c0fb93-ea38-45bc-9267-c42cf0d2c844"]
 *                           name:
 *                             type: string
 *                             examples: ["CoolBlueprint"]
 *                       content:
 *                         type: object
 *                         description: JSON content for the component
 *                         schema: {}
 *                         examples: [{
 *                           "stringField1": "stringField_someValue",
 *                           "numberField1": 101
 *                         }]
 *                     required:
 *                       - project
 *                       - updatedOn
 *                       - updatedBy
 *                       - blueprintVersion
 *                       - content
 *             required:
 *               - message
 *               - component
 */

/*******************************************
 * GET COMPONENT                           *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/components/{componentId}:
 *   get:
 *     tags:
 *       - Component
 *     summary: Get Component Details
 *     description: Gets component data based on the unique id of the project/component
 *     operationId: getComponentById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/ComponentIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetComponentResponse"
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
