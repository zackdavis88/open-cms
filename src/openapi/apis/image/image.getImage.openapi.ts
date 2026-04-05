/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetImageResponse:
 *       description: Image successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Requested image data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["image has been successfully retrieved"]
 *               image:
 *                 description: Requested image details
 *                 allOf:
 *                   - $ref: "#/components/schemas/ImageData"
 *                   - type: object
 *                     properties:
 *                       project:
 *                         $ref: "#/components/schemas/MinimalProjectData"
 *                     required:
 *                       - project
 *             required:
 *               - message
 *               - image
 */

/*******************************************
 * GET IMAGE                               *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/images/{imageId}:
 *   get:
 *     tags:
 *       - Image
 *     summary: Get Image Details
 *     description: Gets image data based on the unique id of the project/image
 *     operationId: getImageById
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/ImageIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetImageResponse"
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
