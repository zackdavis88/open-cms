/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateProjectBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the project
 *                 examples: ["MyFancyProject"]
 *               description:
 *                 type: string
 *                 description: Description of the project
 *                 examples: ["Super fancy, Super cool"]
 *             required:
 *                - name
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateProjectResponse:
 *       description: Project successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New project data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["project has been successfully created"]
 *               project:
 *                 description: Created project details
 *                 $ref: "#/components/schemas/ProjectData"
 *             required:
 *               - message
 *               - project
 */

/*******************************************
 * CREATE PROJECT                          *
 *******************************************/
/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Project
 *     summary: Create Project
 *     description: Creates a new project with provided name and description
 *     operationId: createProject
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateProjectBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateProjectResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
