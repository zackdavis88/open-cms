/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     UpdateMembershipBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAdmin:
 *                 type: boolean
 *                 description: Admin privileges
 *                 examples: [false, true]
 *               isWriter:
 *                 type: boolean
 *                 description: Writer privileges
 *                 examples: [true, false]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     UpdateMembershipResponse:
 *       description: Membership successfully updated
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Updated membership data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["membership has been successfully updated"]
 *               membership:
 *                 description: Updated membership details
 *                 allOf:
 *                   - $ref: "#/components/schemas/MembershipData"
 *                   - type: object
 *                     required:
 *                       - project
 *                       - updatedOn
 *                       - updatedBy
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       updatedOn:
 *                         type: ["string"]
 *                         format: date-time
 *                         description: Timestamp of when the membership was updated
 *                         examples: ["2025-12-27T15:54:47.862Z"]
 *                       updatedBy:
 *                         type: ["object"]
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the last update
 *             required:
 *               - message
 *               - membership
 */

/*******************************************
 * UPDATE MEMBERSHIP                       *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/memberships/{membershipId}:
 *   patch:
 *     tags:
 *       - Membership
 *     summary: Update Membership Details
 *     description: Updates user privileges for a project
 *     operationId: updateMembership
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/MembershipIdParam"
 *     requestBody:
 *       $ref: "#/components/requestBodies/UpdateMembershipBody"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/UpdateMembershipResponse"
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
