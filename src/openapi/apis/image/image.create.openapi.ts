/*******************************************
 * REQUEST BODY                            *
 *******************************************/
/**
 * @openapi
 * components:
 *   requestBodies:
 *     CreateImageBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     CreateImageResponse:
 *       description: Image successfully created
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: New image data
 *             properties:
 *               message:
 *                 type: string
 *                 description: Successful message
 *                 examples: ["images successfully uploaded"]
 *               project:
 *                 $ref: "#/components/schemas/MinimalProjectData"
 *               createdBy:
 *                 $ref: "#/components/schemas/PublicUserData"
 *               images:
 *                 type: array
 *                 description: Uploaded image details
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       description: Unique id of the image
 *                     originalFileName:
 *                       type: string
 *                       description: Original file name that was uploaded
 *                       examples: ["my-fancy-file"]
 *                     extension:
 *                       type: string
 *                       description: File extension
 *                       pattern: '^\.(jpeg|jpg|png|webp|gif)$'
 *                       examples: [".gif"]
 *                     url:
 *                       type: string
 *                       description: URL to access the uploaded image
 *                       examples: ["https://open-cms.com/static/f8f906f0-9f48-43b4-a900-c39309192538/d5254138-251d-44eb-8b89-2b05f867ab15.gif"]
 *                     createdOn:
 *                       type: string
 *                       format: date-time
 */

/*******************************************
 * CREATE IMAGES                           *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/images:
 *   post:
 *     tags:
 *       - Image
 *     summary: Create Images
 *     description: Uploads images for a project
 *     operationId: createImages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateImageBody"
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/CreateImageResponse"
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
