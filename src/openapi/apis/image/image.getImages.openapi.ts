/*******************************************
 * PARAMETERS                              *
 *******************************************/
/**
 * @openapi
 * components:
 *   parameters:
 *     GetImagesOrderColumnParam:
 *       name: orderColumn
 *       description: Column to order results by
 *       in: query
 *       schema:
 *         type: string
 *         enum: [originalFileName, extension, createdOn, __createdBy_username]
 *     GetImagesFilterStringColumnParam:
 *       name: filterStringColumn
 *       description: String column to filter results with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [originalFileName, extension, __createdBy_username]
 *       style: form
 *       explode: true
 *     GetImagesFilterDateColumnParam:
 *       name: filterDateColumn
 *       description: Date column to filter with
 *       in: query
 *       schema:
 *         type: string
 *         enum: [createdOn]
 */

/*******************************************
 * RESPONSE                                *
 *******************************************/
/**
 * @openapi
 * components:
 *   responses:
 *     GetImagesResponse:
 *       description: Image list successfully retrieved
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - type: object
 *                 description: Requested image list data
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Successful message
 *                     examples: ["image list has been successfully retrieved"]
 *                   project:
 *                     $ref: "#/components/schemas/MinimalProjectData"
 *                   images:
 *                     type: array
 *                     description: Requested image list details
 *                     items:
 *                       $ref: "#/components/schemas/ImageData"
 *                 required:
 *                   - message
 *                   - images
 *                   - project
 *               - $ref: "#/components/schemas/PaginationData"
 */

/*******************************************
 * GET IMAGES                              *
 *******************************************/
/**
 * @openapi
 * /projects/{projectId}/images:
 *   get:
 *     tags:
 *       - Image
 *     summary: Get Image List
 *     description: Gets a pagintated list of images
 *     operationId: getImageList
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: "#/components/parameters/ProjectIdParam"
 *       - $ref: "#/components/parameters/PageParam"
 *       - $ref: "#/components/parameters/ItemsPerPageParam"
 *       - $ref: "#/components/parameters/GetImagesOrderColumnParam"
 *       - $ref: "#/components/parameters/OrderByValueParam"
 *       - $ref: "#/components/parameters/GetImagesFilterStringColumnParam"
 *       - $ref: "#/components/parameters/FilterStringValueParam"
 *       - $ref: "#/components/parameters/GetImagesFilterDateColumnParam"
 *       - $ref: "#/components/parameters/FilterDateValueParam"
 *       - $ref: "#/components/parameters/FilterDateOpParam"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/GetImagesResponse"
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
