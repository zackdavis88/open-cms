/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateMembershipBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAdmin:
 *                 type: boolean
 *                 description: New membership admin permissions
 *                 examples: [false, true]
 *               isWriter:
 *                 type: boolean
 *                 description: New membership writer permissions
 *                 examples: [true, false]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateMembershipResponse:
 *       description: Membership successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New membership data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["membership has been successfully created"]
 *               membership:
 *                 description: Created membership details
 *                 $ref: "#/components/schemas/MembershipData"
 *             required:
 *               - message
 *               - membership
 */

/*******************************************
 * CREATE MEMBERSHIP                       *
 *******************************************/
/**
 * @openapi
 * /api/projects/{projectId}/memberships/{username}:
 *   post:
 *     tags:
 *       - Membership
 *     summary: Create Membership
 *     description: Creates a new membership for a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateMembershipBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/UsernameParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateMembershipResponse"
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
