/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateProjectRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the project
 *           examples: ["MyFancyProject"]
 *         description:
 *           type: string
 *           description: Description of the project
 *           examples: ["Super fancy, Super cool"]
 *       required:
 *         - name
 *     CreateProjectResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["project has been successfully created"]
 *         project:
 *           description: Created project details
 *           $ref: "#/components/schemas/ProjectData"
 *         membership:
 *           description: Admin membership details
 *           $ref: "#/components/schemas/MembershipData"
 *       required:
 *         - message
 *         - project
 *         - membership
 */

/*******************************************
 * CREATE PROJECT ENDPOINT                 *
 *******************************************/
/**
 * @openapi
 * /api/projects:
 *   post:
 *     tags:
 *       - Project
 *     summary: Create Project
 *     description: Creates a new project with provided name and description
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateProjectRequest"
 *     responses:
 *       200:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateProjectResponse"
 *       401:
 *         description: Authentication Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthenticationError"
 *       422:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ValidationError"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FatalError"
 */
