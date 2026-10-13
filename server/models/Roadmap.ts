import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapMilestone {
  milestoneId: string;
  title: string;
  learningObjective: string;
  skillsCovered: string[];
  practicalTask: string;
  completionCriteria: string;
  estimatedEffort: string;
  status: 'not_started' | 'in_progress' | 'completed';
  isGapTargeted: boolean;
  completedAt?: Date;
}

export interface IRoadmapStage {
  stageNumber: number;
  stageName: string;
  milestones: IRoadmapMilestone[];
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  careerSlug: string;
  careerTitle: string;
  stages: IRoadmapStage[];
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IRoadmapMilestone>(
  {
    milestoneId: { type: String, required: true },
    title: { type: String, required: true },
    learningObjective: { type: String, required: true },
    skillsCovered: { type: [String], default: [] },
    practicalTask: { type: String, required: true },
    completionCriteria: { type: String, required: true },
    estimatedEffort: { type: String, required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    isGapTargeted: { type: Boolean, default: false },
    completedAt: { type: Date }
  },
  { _id: false }
);

const StageSchema = new Schema<IRoadmapStage>(
  {
    stageNumber: { type: Number, required: true },
    stageName: { type: String, required: true },
    milestones: { type: [MilestoneSchema], default: [] }
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    careerId: { type: Schema.Types.ObjectId, ref: 'Career', required: true },
    careerSlug: { type: String, required: true, index: true },
    careerTitle: { type: String, required: true },
    stages: { type: [StageSchema], default: [] },
    totalMilestones: { type: Number, default: 0 },
    completedMilestones: { type: Number, default: 0 },
    progressPercentage: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

RoadmapSchema.index({ userId: 1, careerSlug: 1 }, { unique: true });

export const Roadmap = mongoose.models.Roadmap || mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
