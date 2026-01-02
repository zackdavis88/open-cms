/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveComponentBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["confirm"]
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Case-sensitive name of the component
 *                 examples: ["AwesomeComponent"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveComponentResponse:
 *       description: Component successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted component data
 *             required: ["message", "component"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["component has been successfully removed"]
 *               component:
 *                 description: Deleted component details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ComponentData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the component was last updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       deletedOn:
 *                         type: "string"
 *                         format: date-time
 *                         description: Timestamp of when the component was deleted
 *                         examples: ["2026-01-20T15:54:47.862Z"]
 *                       deletedBy:
 *                         type: "object"
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the deletion
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
 *                       - deletedOn
 *                       - deletedBy
 *                       - blueprintVersion
 *                       - content
 */

/*******************************************
 * REMOVE COMPONENT                        *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/components/{componentId}:
 *   delete:
 *     tags:
 *       - Component
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/ComponentIdParam"
 *     summary: Delete Component
 *     description: Deletes a component
 *     operationId: removeComponent
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveComponentBody"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveComponentResponse"
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
