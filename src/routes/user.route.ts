import { FastifyInstance } from 'fastify';
import upload from '../uploads'; // import the multer config
import {
  registerUser,
  loginUser,
  listUsers,
  updateUserById,
  deleteUserById,
} from '../controllers/user.controller';

export default async function userRoutes(fastify: FastifyInstance) {
  // ✅ Register user with optional profilePic
  fastify.post('/register', { preHandler: upload.single('profilePic') }, registerUser);

  fastify.post('/login', loginUser);
  fastify.get('/', listUsers);

  // ✅ Allow updating profilePic as well
  fastify.put('/:id', { preHandler: upload.single('profilePic') }, updateUserById);

  fastify.delete('/:id', deleteUserById);
}
