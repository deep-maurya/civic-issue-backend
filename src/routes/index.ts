import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import userRoutes from './user.route';
import issueRoutes from './issue.route';

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: '/users' });
  app.register(issueRoutes, { prefix: '/issues' });
};

export default routes;
