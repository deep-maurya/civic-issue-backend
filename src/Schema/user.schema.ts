import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserRole = 'user' | 'admin' | 'worker';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdBy?: mongoose.Types.ObjectId;
  isActive: boolean;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'worker'], default: 'user' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
