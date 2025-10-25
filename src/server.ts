import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import fastifyMulter from 'fastify-multer';
import path from 'path';
import fastifyStatic from '@fastify/static';

dotenv.config();

const startServer = async () => {
  const app = Fastify({ logger: true });

  // Register CORS
  await app.register(cors, { origin: '*' });

  // Register Multer parser
  await app.register(fastifyMulter.contentParser);

  // Serve static /uploads folder
  app.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/', // accessible as /uploads/<filename>
  });

  // Connect to MongoDB
  await connectDB();

  // Register routes
  await app.register(routes, { prefix: '/api/v1' });

  app.get('/', async () => {
    return { message: '🚀 Fastify server running!' };
  });

  const PORT = Number(process.env.PORT) || 5000;
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${PORT}`);
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
