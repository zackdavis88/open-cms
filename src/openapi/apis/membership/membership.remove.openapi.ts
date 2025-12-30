/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveMembershipBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["confirm"]
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: displayName of the membership's user
 *                 examples: ["JohnDoe"]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveMembershipResponse:
 *       description: Membership successfully deleted
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted membership data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["membership has been successfully removed"]
 *               membership:
 *                 description: Deleted membership details
 *                 allOf:
 *                   - $ref: "#/components/schemas/MembershipData"
 *                   - type: object
 *                     required: ["project", "updatedOn", "updatedBy"]
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string", "null"]
 *                         format: date-time
 *                         description: Timestamp of when the membership was updated
 *                         examples: ["2025-12-27T15:54:47.862Z", null]
 *                       updatedBy:
 *                         type: ["object", "null"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *             required:
 *               - message
 *               - membership
 */

/*******************************************
 * REMOVE MEMBERSHIP                       *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/memberships/{membershipId}:
 *   delete:
 *     tags:
 *       - Membership
 *     summary: Delete Membership
 *     description: Deletes a memberships for a project
 *     operationId: removeMembership
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/MembershipIdParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveMembershipBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveMembershipResponse"
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
