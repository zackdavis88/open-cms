/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveUserBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Your account's displayName value
 *                 examples: ["JohnDoe"]
 *             required:
 *                - confirm
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveUserResponse:
 *       description: User successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted user's data
 *             required: ["message", "user"]
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["user has been successfully removed"]
 *               user:
 *                 description: User that was deleted
 *                 allOf:
 *                   - $ref: "#/components/schemas/UserData"
 *                   - type: object
 *                     required: ["deletedOn"]
 *                     properties:
 *                       deletedOn:
 *                         type: string
 *                         format: date-time
 *                         examples: [2023-11-11T05:32:01.250Z]
 */

/*******************************************
 * DELETE USER                             *
 *******************************************/
/**
 * @openapi
 * /api/users/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete User
 *     description: Deletes a user
 *     operationId: removeUser
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveUserBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveUserResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
