import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  actionType:
    | 'assessment_completed'
    | 'skill_updated'
    | 'target_career_selected'
    | 'milestone_completed'
    | 'milestone_started'
    | 'project_started'
    | 'project_completed'
    | 'resource_completed';
  title: string;
  description: string;
  meta?: Record<string, any>;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    actionType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, default: {} }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

ActivityLogSchema.index({ userId: 1, createdAt: -1 });

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
