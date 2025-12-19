/*******************************************
 * COMPONENTS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   schemas:
 *     RemoveUserRequest:
 *       type: object
 *       properties:
 *         confirm:
 *           type: string
 *           description: Your account's displayName value
 *           examples: ["JohnDoe"]
 *       required:
 *         - confirm
 *     RemoveUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Successful message
 *           examples: ["user has been successfully removed"]
 *         user:
 *           allOf:
 *             - $ref: "#/components/schemas/UserData"
 *               description: Removed user details
 *             - type: object
 *               properties:
 *                 deletedOn:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the user was deleted
 *                   examples: ['2023-11-11T15:00:00.000Z']
 *               required:
 *                 - deletedOn
 *       required:
 *         - message
 *         - user
 */

/*******************************************
 * DELETE USER ENDPOINT                    *
 *******************************************/
/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete User
 *     description: Deletes a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RemoveUserRequest"
 *     responses:
 *       200:
 *         description: User password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RemoveUserResponse"
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
