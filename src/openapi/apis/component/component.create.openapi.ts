/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateComponentBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["name", "content"]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the new component
 *                 examples: ["AwesomeComponent"]
 *               content:
 *                 type: object
 *                 description: JSON content for the component, must match the blueprint shape
 *                 schema: {}
 *                 examples: [{
 *                   "stringField1": "stringField_someValue",
 *                   "numberField1": 101
 *                 }]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateComponentResponse:
 *       description: Component successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New component data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["component has been successfully created"]
 *               component:
 *                 description: Created component details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ComponentData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       content:
 *                         type: object
 *                         schema: {}
 *                         examples: [{
 *                           "stringField1": "stringField_someValue",
 *                           "numberField1": 101
 *                         }]
 *                     required:
 *                       - project
 *                       - content
 *             required:
 *               - message
 *               - component
 */

/*******************************************
 * CREATE COMPONENT                        *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/components/{blueprintId}:
 *   post:
 *     tags:
 *       - Component
 *     summary: Create Component
 *     description: Creates a new component
 *     operationId: createComponent
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateComponentBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/BlueprintIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateComponentResponse"
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
