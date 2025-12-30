import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from 'src/openapi';
import customThemeStyles from 'src/openapi/custom-theme/custom-theme-styles';
import customThemeToggle from 'src/openapi/custom-theme/custom-theme-toggle';

export const baseUrl = '/docs';

const configureDocumentationRoutes = (router: Router) => {
  // Serve the custom JS and (optionally) CSS for theme toggling before the swagger static serve
  router.get('/custom-theme.js', (_req, res) => {
    res.type('application/javascript').send(customThemeToggle);
  });
  router.get('/custom-theme.css', (_req, res) => {
    res.type('text/css').send(customThemeStyles);
  });

  router.use('/', swaggerUi.serve);
  router.route('/').get(
    swaggerUi.setup(swaggerSpec, {
      customJs: [`${baseUrl}/custom-theme.js`],
      customCssUrl: `${baseUrl}/custom-theme.css`,
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'Open CMS Documentation',
    }),
  );
};

export default configureDocumentationRoutes;
