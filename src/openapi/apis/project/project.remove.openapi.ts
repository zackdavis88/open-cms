/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveProjectBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Case-sensitive name of the project
 *                 examples: ["MyFancyProject"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveProjectResponse:
 *       description: Project successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted project data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["project has been successfully removed"]
 *               project:
 *                 description: Deleted project details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ProjectData"
 *                   - type: object
 *                     properties:
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the project was updated
 *                         examples: ["2025-12-20T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *                       deletedOn:
 *                         type: string
 *                         format: date-time
 *                         description: Timestamp of when the project was deleted
 *                         examples: ["2025-12-24T15:54:47.862Z", null]
 *                       deletedBy:
 *                         type: object
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User that deleted the project
 *       required:
 *         - message
 *         - project
 */

/*******************************************
 * REMOVE PROJECT                          *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}:
 *   delete:
 *     tags:
 *       - Project
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     summary: Delete Project
 *     description: Deletes a project
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveProjectBody"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveProjectResponse"
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
