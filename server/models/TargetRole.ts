import mongoose, { Document, Schema } from 'mongoose';
import { ILearningResource, IPortfolioProjectDef, IMilestoneTemplate } from './Career.ts';

export interface IRoleRequirementSkill {
  name: string;
  category: string;
  minLevel: number; // 1 to 5
  importance: 'Required' | 'Important' | 'Optional';
  weight: number; // 3, 2, 1
  reason?: string;
}

export interface IReadinessQuizQuestion {
  quizId: string;
  skillName: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ITargetRole extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  source: 'recommended' | 'custom' | 'job_description' | 'benchmark';
  isProvisionalBenchmark: boolean;
  benchmarkSlug?: string;
  jobDescriptionText?: string;
  seniority: string;
  mandatorySkills: IRoleRequirementSkill[];
  importantSkills: IRoleRequirementSkill[];
  preferredSkills: IRoleRequirementSkill[];
  toolsAndTechnologies: string[];
  practicalCapabilities: string[];
  learningResources: ILearningResource[];
  portfolioProjects: IPortfolioProjectDef[];
  milestonesTemplate: IMilestoneTemplate[];
  readinessQuizzes: IReadinessQuizQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const RoleSkillSchema = new Schema<IRoleRequirementSkill>(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'Technical' },
    minLevel: { type: Number, required: true, min: 1, max: 5, default: 3 },
    importance: { type: String, enum: ['Required', 'Important', 'Optional'], required: true },
    weight: { type: Number, required: true, default: 2 },
    reason: { type: String, default: '' }
  },
  { _id: false }
);

const QuizSchema = new Schema<IReadinessQuizQuestion>(
  {
    quizId: { type: String, required: true },
    skillName: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: Number, required: true },
    explanation: { type: String, default: '' }
  },
  { _id: false }
);

const TargetRoleSchema = new Schema<ITargetRole>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestId: { type: String, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    category: { type: String, default: 'Software Engineering' },
    description: { type: String, default: '' },
    source: {
      type: String,
      enum: ['recommended', 'custom', 'job_description', 'benchmark'],
      default: 'recommended'
    },
    isProvisionalBenchmark: { type: Boolean, default: false },
    benchmarkSlug: { type: String },
    jobDescriptionText: { type: String, default: '' },
    seniority: { type: String, default: 'Entry-Level / Graduate' },
    mandatorySkills: { type: [RoleSkillSchema], default: [] },
    importantSkills: { type: [RoleSkillSchema], default: [] },
    preferredSkills: { type: [RoleSkillSchema], default: [] },
    toolsAndTechnologies: { type: [String], default: [] },
    practicalCapabilities: { type: [String], default: [] },
    learningResources: [
      {
        title: { type: String, required: true },
        provider: { type: String, required: true },
        relatedSkills: { type: [String], default: [] },
        resourceType: { type: String, default: 'Guide' },
        difficulty: { type: String, default: 'Intermediate' },
        estimatedHours: { type: Number, default: 10 },
        url: { type: String, default: '#' },
        description: { type: String, default: '' }
      }
    ],
    portfolioProjects: [
      {
        projectId: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        difficulty: { type: String, default: 'Intermediate' },
        estimatedHours: { type: Number, default: 20 },
        skillsDeveloped: { type: [String], default: [] },
        deliverables: { type: [String], default: [] },
        completionCriteria: { type: [String], default: [] }
      }
    ],
    milestonesTemplate: [
      {
        stage: { type: Number, required: true },
        stageName: { type: String, required: true },
        title: { type: String, required: true },
        learningObjective: { type: String, required: true },
        skillsCovered: { type: [String], default: [] },
        practicalTask: { type: String, required: true },
        completionCriteria: { type: String, required: true },
        estimatedEffort: { type: String, required: true }
      }
    ],
    readinessQuizzes: { type: [QuizSchema], default: [] }
  },
  { timestamps: true }
);

export const TargetRole = mongoose.model<ITargetRole>('TargetRole', TargetRoleSchema);
