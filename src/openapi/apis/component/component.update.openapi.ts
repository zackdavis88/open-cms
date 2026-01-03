/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdateComponentBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the component
 *                 examples: ["UpdatedAwesomeComponent"]
 *               content:
 *                 type: object
 *                 description: JSON content for the component, must match the blueprint (or blueprintVersion) shape
 *                 schema: {}
 *                 examples: [{
 *                   "stringField1": "stringField_updated",
 *                   "numberField1": 255
 *                 }]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdateComponentResponse:
 *       description: Component successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated component data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["component has been successfully updated"]
 *               component:
 *                 description: Updated component details
 *                 allOf:
 *                   - type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         examples: ["UpdatedAwesomeComponent"]
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of when the component was updated
 *                         examples: ["2025-12-20T15:54:47.862Z"]
 *                       updatedBy:
 *                         type: object
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       blueprintVersion:
 *                         type: ["object", "null"]
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
 *                         schema: {}
 *                         examples: [{
 *                           "stringField1": "stringField_updated",
 *                           "numberField1": 255
 *                         }]
 *                     required:
 *                       - updatedOn
 *                       - updatedBy
 *                       - blueprintVersion
 *                       - project
 *                       - content
 *                   - $ref: "#/components/schemas/ComponentData"
 *             required:
 *               - message
 *               - component
 */

/*******************************************
 * UPDATE COMPONENT                        *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/components/{componentId}:
 *   patch:
 *     tags:
 *       - Component
 *     summary: Update Component
 *     description: Updates a component
 *     operationId: updateComponent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateComponentBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/ComponentIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdateComponentResponse"
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
