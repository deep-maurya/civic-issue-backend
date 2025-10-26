import { FastifyInstance } from 'fastify';
import {
  registerUser,
  loginUser,
  listUsers,
  updateUserById,
  deleteUserById,
  logoutUser,
} from '../controllers/user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/register', registerUser);
  fastify.post('/login', loginUser);
  fastify.get('/', listUsers);
  fastify.put('/:id', updateUserById);
  fastify.delete('/:id', deleteUserById);
  fastify.post('/logout', logoutUser);
}
