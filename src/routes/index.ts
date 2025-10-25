import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import userRoutes from './user.route';

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: '/users' });
};

export default routes;
