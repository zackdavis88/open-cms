import { Router } from 'express';
import { swaggerSpec } from 'src/openapi';

const configureDiscoveryRoutes = (router: Router) => {
  router.route('/discovery').get((_req, res) => {
    return res.json(swaggerSpec);
  });
};

export default configureDiscoveryRoutes;
