/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdateProjectBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: ["string", "null"]
 *                 description: New name of the project
 *                 examples: ["SomethingNewButStillFancy"]
 *               description:
 *                 type: ["string", "null"]
 *                 description: New description of the project
 *                 examples: ["This project is updated, but still fancy!"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdateProjectResponse:
 *       description: Project successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated project data
 *             required: ["message", "project"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["project has been successfully updated"]
 *               project:
 *                 description: Updated project details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ProjectData"
 *                   - type: object
 *                     required: ["updatedOn", "updatedBy"]
 *                     properties:
 *                       updatedOn:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of when the project was updated
 *                         examples: ["2025-12-20T15:54:47.862Z"]
 *                       updatedBy:
 *                         type: object
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 */

/*******************************************
 * UPDATE PROJECT                          *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}:
 *   patch:
 *     tags:
 *       - Project
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     summary: Update Project Details
 *     description: Updated project data
 *     operationId: updateProject
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateProjectBody"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdateProjectResponse"
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
