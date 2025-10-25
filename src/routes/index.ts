import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import userRoutes from './user.route';
import issueRoutes from './issue.route';
import { authMiddleware } from '../middlewares/auth.middleware';
import publicRoutes from '../constants/publicRoutes';

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.addHook('preHandler', async (req, reply) => {
    const url = req.routeOptions?.url;
    if (!url || publicRoutes.includes(url)) {
      return;
    }
    await authMiddleware(req, reply);
  });

  app.register(userRoutes, { prefix: '/users' });
  app.register(issueRoutes, { prefix: '/issues' });
};

export default routes;
