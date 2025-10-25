import Fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from 'fastify-cookie';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import routes from './routes';
import allowedOrigins from './constants/allowedOrigins';

dotenv.config();

const startServer = async () => {
  // Create Fastify instance
  const app = Fastify({ logger: true });

  // Register CORS
  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        return cb(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  await app.register(cookie);

  // Connect to MongoDB
  await connectDB();

  // Register routes
  await app.register(routes, { prefix: '/api/v1' });

  app.get('/', async () => {
    return { message: '🚀 Fastify server running!' };
  });

  // Start server
  const PORT = Number(process.env.PORT) || 5000;
  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Server running on http://localhost:${PORT}`);
};

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});
