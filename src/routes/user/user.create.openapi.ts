/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Unique username for the user
 *           examples: ["JohnDoe"]
 *         password:
 *           type: string
 *           description: Password for the user account
 *           examples: ["SecureP@ssw0rd!"]
 *       required:
 *         - username
 *         - password
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user created successfully"]
 *         user:
 *           type: object
 *           description: Created user's details
 *           properties:
 *             username:
 *               type: string
 *               description: Unique, lowercase, username for the user
 *               examples: ["johndoe"]
 *             displayName:
 *               type: string
 *               description: Unique, case-sensitive display name for the user
 *               examples: ["JohnDoe"]
 *             createdOn:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the user was created
 *               examples: ["2023-10-05T14:48:00.000Z"]
 *           required:
 *             - username
 *             - displayName
 *             - createdOn
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * CREATE USER ENDPOINT                    *
 *******************************************/
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - User
 *     summary: Create User
 *     description: Creates a new user with provided username and password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateUserRequest"
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateUserResponse"
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
