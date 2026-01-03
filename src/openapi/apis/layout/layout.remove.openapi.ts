/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveLayoutBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["confirm"]
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Case-sensitive name of the layout
 *                 examples: ["TheBestLayout"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveLayoutResponse:
 *       description: Layout successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted layout data
 *             required: ["message", "layout"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["layout has been successfully removed"]
 *               layout:
 *                 description: Deleted layout details
 *                 allOf:
 *                   - $ref: "#/components/schemas/LayoutData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the layout was last updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       deletedOn:
 *                         type: "string"
 *                         format: date-time
 *                         description: Timestamp of when the layout was deleted
 *                         examples: ["2026-01-20T15:54:47.862Z"]
 *                       deletedBy:
 *                         type: "object"
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the deletion
 *                       layoutComponents:
 *                         description: Array of ordered components
 *                         examples: [[
 *                           {"id": "5acefd12-9cb6-47d3-980d-386e4deffb1b", "name": "Component1", "content": {"stringField": "stringValue"}},
 *                           {"id": "9a70d540-0f7d-4b59-b495-65685a809103", "name": "Component2", "content": {"objectField": {"booleanField": true}}},
 *                           {"id": "397751f4-0e06-4ae0-b8ff-ee115e30eebd", "name": "Component3", "content": {"numberField": 255}}
 *                         ]]
 *                         items:
 *                           type: object
 *                           required: ["id", "name", "content"]
 *                           properties:
 *                             id:
 *                               description: Unique id of the component
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               description: Name of the component
 *                               type: string
 *                             content:
 *                               description: Content of the component
 *                               type: object
 *                               schema: {}
 *                     required: ["project", "updatedOn", "updatedBy", "deletedOn", "deletedBy", "layoutComponents"]
 */

/*******************************************
 * REMOVE LAYOUT                           *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/layouts/{layoutId}:
 *   delete:
 *     tags:
 *       - Layout
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/LayoutIdParam"
 *     summary: Delete Layout
 *     description: Deletes a component
 *     operationId: removeLayout
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveLayoutBody"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveLayoutResponse"
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
