/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     UpdatePasswordRequest:
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
 *     UpdatePasswordResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user password successfully updated"]
 *         user:
 *           $ref: "#/components/schemas/UserData"
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
 *             $ref: "#/components/schemas/UpdatePasswordRequest"
 *     responses:
 *       200:
 *         description: User password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdatePasswordResponse"
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
