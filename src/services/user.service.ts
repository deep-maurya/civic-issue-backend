import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { IUser, UserRole } from '../Schema/user.schema';

export const createUser = async (
  data: { name: string; email: string; password: string; role?: UserRole },
  creatorId?: string
): Promise<IUser> => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = new User({
    ...data,
    password: hashedPassword,
    createdBy: creatorId ? new mongoose.Types.ObjectId(creatorId) : undefined,
  });
  return user.save();
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

export const getAllUsers = async (): Promise<IUser[]> => {
  return User.find();
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    profilePic: string;
  }>
): Promise<IUser | null> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return User.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id);
};
