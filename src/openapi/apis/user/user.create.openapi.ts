/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateUserBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 examples: ["JohnDoe"]
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 examples: ["SecureP@ssw0rd!"]
 *             required:
 *                - username
 *                - password
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateUserResponse:
 *       description: User created successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New user data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["user has been successfully created"]
 *               user:
 *                 description: Created user details
 *                 $ref: "#/components/schemas/PublicUserData"
 *             required:
 *               - message
 *               - user
 */

/*******************************************
 * CREATE USER                             *
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
 *       $ref: "#/components/requestBodies/CreateUserBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateUserResponse"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
