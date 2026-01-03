/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateLayoutBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["name", "layoutComponents"]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new layout
 *                 examples: ["TheBestLayout"]
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
 *     CreateLayoutResponse:
 *       description: Layout successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New layout data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["layout has been successfully created"]
 *               layout:
 *                 description: Created layout details
 *                 allOf:
 *                   - $ref: "#/components/schemas/LayoutData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
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
 *                     required:
 *                       - project
 *                       - layoutComponents
 *             required:
 *               - message
 *               - layout
 */

/*******************************************
 * CREATE LAYOUT                           *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/layouts:
 *   post:
 *     tags:
 *       - Layout
 *     summary: Create Layout
 *     description: Creates a new layout
 *     operationId: createLayout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateLayoutBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateLayoutResponse"
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
