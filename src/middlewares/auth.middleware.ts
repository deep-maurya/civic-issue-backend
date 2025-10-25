import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import publicRoutes from '../constants/publicRoutes';

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const path = req.url.split('?')[0];
  const method = req.method;
  const isPublic = publicRoutes.some(
    (r) => r.path === path && (r.method === 'ALL' || r.method === method)
  );
  if (isPublic) return;

  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies.token || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
      return reply.status(401).send({
        status: false,
        error: 'AUTH_TOKEN_MISSING',
        message: 'Authentication failed',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    (req as any).user = decoded;
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return reply.status(401).send({
        status: false,
        error: 'TOKEN_EXPIRED',
        message: 'Session expired. Please log in again.',
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return reply.status(401).send({
        status: false,
        error: 'TOKEN_INVALID',
        message: 'Invalid authentication token.',
      });
    }
    return reply.status(500).send({
      status: false,
      error: 'AUTH_ERROR',
      message: 'Internal authentication error.',
    });
  }
};
