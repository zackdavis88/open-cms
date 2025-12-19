/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdatePasswordBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Your current password
 *                 examples: ["SecureP@ssw0rd!"]
 *               newPassword:
 *                 type: string
 *                 description: Your new password
 *                 examples: ["SecureP@ssw0rd!Updated!"]
 *             required:
 *               - currentPassword
 *               - newPassword
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdatePasswordResponse:
 *       description: User password successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated user data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["user password successfully updated"]
 *               user:
 *                 description: Updated user details
 *                 $ref: "#/components/schemas/UserData"
 *             required:
 *               - message
 *               - user
 */

/*******************************************
 * UPDATE PASSWORD                         *
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
 *       $ref: "#/components/requestBodies/UpdatePasswordBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdatePasswordResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
