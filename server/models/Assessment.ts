import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillComparisonItem {
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  weight: number;
  importance: 'Required' | 'Important' | 'Optional';
  completionRatio: number;
  status: 'met' | 'partial' | 'missing';
}

export interface ISkillGapItem {
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
  importance: 'Required' | 'Important' | 'Optional';
  weight: number;
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  careerId: mongoose.Types.ObjectId;
  careerSlug: string;
  careerTitle: string;
  readinessScore: number;
  skillsMet: number;
  skillsPartial: number;
  skillsMissing: number;
  totalRequiredWeight: number;
  achievedWeightedScore: number;
  detailedSkills: ISkillComparisonItem[];
  rankedGaps: ISkillGapItem[];
  recommendedNextAction: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    careerId: { type: Schema.Types.ObjectId, ref: 'Career', required: true, index: true },
    careerSlug: { type: String, required: true },
    careerTitle: { type: String, required: true },
    readinessScore: { type: Number, required: true, min: 0, max: 100 },
    skillsMet: { type: Number, default: 0 },
    skillsPartial: { type: Number, default: 0 },
    skillsMissing: { type: Number, default: 0 },
    totalRequiredWeight: { type: Number, default: 0 },
    achievedWeightedScore: { type: Number, default: 0 },
    detailedSkills: [
      {
        skillName: { type: String, required: true },
        category: { type: String, default: '' },
        currentLevel: { type: Number, required: true },
        targetLevel: { type: Number, required: true },
        weight: { type: Number, required: true },
        importance: { type: String, required: true },
        completionRatio: { type: Number, required: true },
        status: { type: String, enum: ['met', 'partial', 'missing'], required: true }
      }
    ],
    rankedGaps: [
      {
        skillName: { type: String, required: true },
        category: { type: String, default: '' },
        currentLevel: { type: Number, required: true },
        targetLevel: { type: Number, required: true },
        gap: { type: Number, required: true },
        importance: { type: String, required: true },
        weight: { type: Number, required: true }
      }
    ],
    recommendedNextAction: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

AssessmentSchema.index({ userId: 1, careerSlug: 1 });

export const Assessment = mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
