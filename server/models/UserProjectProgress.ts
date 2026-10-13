import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProjectProgress extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: string;
  careerSlug: string;
  projectTitle: string;
  status: 'saved' | 'in_progress' | 'completed';
  notes: string;
  repoUrl?: string;
  demoUrl?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserProjectProgressSchema = new Schema<IUserProjectProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: String, required: true },
    careerSlug: { type: String, required: true },
    projectTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ['saved', 'in_progress', 'completed'],
      default: 'saved'
    },
    notes: { type: String, default: '' },
    repoUrl: { type: String, default: '' },
    demoUrl: { type: String, default: '' },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

UserProjectProgressSchema.index({ userId: 1, projectId: 1 }, { unique: true });

export const UserProjectProgress =
  mongoose.models.UserProjectProgress ||
  mongoose.model<IUserProjectProgress>('UserProjectProgress', UserProjectProgressSchema);
