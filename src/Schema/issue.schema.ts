import { Schema, model, Types, Document } from 'mongoose';

export interface IIssue extends Document {
  title: string;
  description: string;
  location: string;
  images?: string[];
  reportedBy: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  opinions: {
    user: Types.ObjectId;
    comment: string;
    date: Date;
  }[];
  upvotes: Types.ObjectId[];
  timeline: {
    status: string;
    by: Types.ObjectId;
    date: Date;
  }[];
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const issueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    opinions: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        date: Date,
      },
    ],
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    timeline: [
      {
        status: { type: String, required: true },
        by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default model<IIssue>('Issue', issueSchema);
