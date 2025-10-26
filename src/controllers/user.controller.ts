import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRole } from '../Schema/user.schema';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
  profilePic?: string;
}

interface Params {
  id: string;
}

export const registerUser = async (
  req: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
) => {
  try {
    const { name, email, password } = req.body;
    const existing = await userService.getUserByEmail(email);
    if (existing) {
      return reply.status(400).send({ message: 'Email already exists' });
    }
    const user = await userService.createUser({ name, email, password });
    reply.send({ status: 'success', user });
  } catch (err: any) {
    reply.status(500).send({ status: 'error', message: err.message });
  }
};

export const loginUser = async (
  req: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return reply
        .status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return reply
        .status(400)
        .send({ status: 'error', message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    reply
      .setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      })
      .send({ status: 'success', user });
  } catch (err: any) {
    reply.status(500).send({ status: 'error', message: err.message });
  }
};

export const listUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (err: any) {
    reply.status(500).send({ message: err.message });
  }
};

export const updateUserById = async (
  req: FastifyRequest<{ Params: Params; Body: UpdateUserBody }>,
  reply: FastifyReply
) => {
  try {
    const updateData = req.body; // TypeScript now knows the shape
    const user = await userService.updateUser(req.params.id, updateData);
    reply.send(user);
  } catch (err: any) {
    reply.status(500).send({ message: err.message });
  }
};

export const deleteUserById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    await userService.deleteUser(req.params.id);
    reply.send({ message: 'User deleted' });
  } catch (err: any) {
    reply.status(500).send({ message: err.message });
  }
};

export const logoutUser = async (req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ status: 'success', message: 'User logged out' });
};
