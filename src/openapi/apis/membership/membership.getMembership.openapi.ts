/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetMembershipResponse:
 *       description: Membership retrieved successfully
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested membership data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["membership has been successfully retrieved"]
 *               membership:
 *                 description: Requested membership details
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
 * GET MEMBERSHIP                          *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/memberships/{membershipId}:
 *   get:
 *     tags:
 *       - Membership
 *     summary: Get Membership Details
 *     description: Gets membership data based on the unique id of the membership
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/MembershipIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetMembershipResponse"
 *       401:
 *         $ref: "#/components/responses/AuthenticationError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 *       422:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
