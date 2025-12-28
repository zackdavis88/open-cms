/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetProjectResponse:
 *       description: Project retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested project data
 *             required: ["message", "project"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["project has been successfully retrieved"]
 *               project:
 *                 description: Requested project details
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
 */

/*******************************************
 * GET PROJECT                             *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}:
 *   get:
 *     tags:
 *       - Project
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     summary: Get Project Details
 *     description: Gets project data based on the unique id of the project
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetProjectResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
