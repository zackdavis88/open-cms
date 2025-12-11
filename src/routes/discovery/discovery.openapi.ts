/*******************************************
 * Discovery                               *
 *******************************************/
/**
 * @openapi
 * /api/discovery/swagger.json:
 *   get:
 *     tags:
 *       - Discovery
 *     description: Returns OpenAPI specs in JSON format
 *     responses:
 *       200:
 *         description: Successfully generated OpenAPI specs
 *         content:
 *           application/json:
 *             properties:
 *               {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/FatalError"
 */
