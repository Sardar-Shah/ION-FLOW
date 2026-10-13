import mongoose, { Document, Schema } from 'mongoose';

export interface IUserResourceProgress extends Document {
  userId: mongoose.Types.ObjectId;
  resourceUrl: string;
  resourceTitle: string;
  careerSlug: string;
  status: 'started' | 'completed';
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserResourceProgressSchema = new Schema<IUserResourceProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resourceUrl: { type: String, required: true },
    resourceTitle: { type: String, required: true },
    careerSlug: { type: String, required: true },
    status: {
      type: String,
      enum: ['started', 'completed'],
      default: 'started'
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  {
    timestamps: true
  }
);

UserResourceProgressSchema.index({ userId: 1, resourceUrl: 1 }, { unique: true });

export const UserResourceProgress =
  mongoose.models.UserResourceProgress ||
  mongoose.model<IUserResourceProgress>('UserResourceProgress', UserResourceProgressSchema);
