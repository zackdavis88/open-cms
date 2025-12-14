/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     UserUpdatePasswordRequest:
 *       type: object
 *       properties:
 *         currentPassword:
 *           type: string
 *           description: Your current password
 *           examples: ["SecureP@ssw0rd!"]
 *         newPassword:
 *           type: string
 *           description: Your new password
 *           examples: ["SecureP@ssw0rd!Updated!"]
 *       required:
 *         - currentPassword
 *         - newPassword
 *     UserUpdatePasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user password successfully updated"]
 *         user:
 *           type: object
 *           description: Updated user's details
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
 *             updatedOn:
 *               type: string
 *               format: date-time
 *               description: Timestamp of when the user was last updated
 *               examples: ["2023-11-05T15:00:00.000Z"]
 *           required:
 *             - username
 *             - displayName
 *             - createdOn
 *             - updatedOn
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * UPDATE PASSWORD ENDPOINT                *
 *******************************************/
/**
 * @openapi
 * /api/users/password:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update User Password
 *     description: Updates a user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserUpdatePasswordRequest"
 *     responses:
 *       200:
 *         description: User password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserUpdatePasswordResponse"
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
