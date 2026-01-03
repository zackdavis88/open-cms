/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdateLayoutBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the layout
 *                 examples: ["UpdatedLayout"]
 *               layoutComponents:
 *                 type: array
 *                 description: Array of valid componentIds
 *                 items:
 *                   - type: string
 *                     format: uuid
 *                 examples: [["5acefd12-9cb6-47d3-980d-386e4deffb1b", "9a70d540-0f7d-4b59-b495-65685a809103", "397751f4-0e06-4ae0-b8ff-ee115e30eebd"]]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdateLayoutResponse:
 *       description: Layout successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated layout data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["layout has been successfully updated"]
 *               layout:
 *                 description: Updated layout details
 *                 allOf:
 *                   - type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         examples: ["UpdatedLayout"]
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of when the layout was updated
 *                         examples: ["2025-12-20T15:54:47.862Z"]
 *                       updatedBy:
 *                         type: object
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
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
 *                     required: ["project", "updatedOn", "updatedBy", "layoutComponents"]
 *                   - $ref: "#/components/schemas/LayoutData"
 *             required:
 *               - message
 *               - layout
 */

/*******************************************
 * UPDATE LAYOUT                           *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/layouts/{layoutId}:
 *   patch:
 *     tags:
 *       - Layout
 *     summary: Update Layout
 *     description: Updates a layout
 *     operationId: updateLayout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateLayoutBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/LayoutIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdateLayoutResponse"
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
