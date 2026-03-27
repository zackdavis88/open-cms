/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     RemoveImageBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["confirm"]
 *             properties:
 *               confirm:
 *                 type: string
 *                 description: Case-sensitive original filename of the image
 *                 examples: ["MyFancyImage"]
 *
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     RemoveImageResponse:
 *       description: Image successfully removed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Deleted image details
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["image has been successfully removed"]
 *               image:
 *                 description: Deleted image data
 *                 allOf:
 *                   - $ref: "#/components/schemas/MinimalImageData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                       deletedOn:
 *                         type: "string"
 *                         format: date-time
 *                         description: Timestamp of when the image was deleted
 *                       deletedBy:
 *                         type: "object"
 *                         $ref: "#/components/schemas/PublicUserData"
 *                         description: User details of the deletion
 *                     required:
 *                       - project
 *                       - deletedOn
 *                       - deletedBy
 *             required:
 *               - message
 *               - image
 */

/*******************************************
 * REMOVE IMAGE                            *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/images/{imageId}:
 *   delete:
 *     tags:
 *       - Image
 *     summary: Delete Image
 *     description: Deletes an image
 *     operationId: removeImage
 *     requestBody:
 *       $ref: "#/components/requestBodies/RemoveImageBody"
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/ImageIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/RemoveImageResponse"
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
