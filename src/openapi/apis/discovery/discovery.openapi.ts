/*******************************************
 * Discovery                               *
 *******************************************/
/**
 * @openapi
 * /api/discovery:
 *   get:
 *     tags:
 *       - Discovery
 *     summary: Get OpenAPI JSON
 *     description: Returns OpenAPI specs in JSON format
 *     responses:
 *       200:
 *         description: Successfully generated OpenAPI specs
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *       500:
 *         $ref: "#/components/responses/FatalError"
 */
