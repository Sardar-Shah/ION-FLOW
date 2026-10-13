import mongoose, { Document, Schema } from 'mongoose';

export interface IRequiredSkill {
  canonicalName: string;
  normalizedName: string;
  category: string;
  targetLevel: number; // 1 to 5
  weight: number; // 3 (Required), 2 (Important), 1 (Optional)
  importance: 'Required' | 'Important' | 'Optional';
  description: string;
}

export interface ILearningResource {
  title: string;
  provider: string;
  relatedSkills: string[];
  resourceType: 'Documentation' | 'Course' | 'Interactive' | 'Guide' | 'Book';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  url: string;
  description: string;
}

export interface IPortfolioProjectDef {
  projectId: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsDeveloped: string[];
  deliverables: string[];
  completionCriteria: string[];
}

export interface IMilestoneTemplate {
  stage: number; // 1 to 5
  stageName: string; // Foundations, Core skills, Practical application, Portfolio development, Career preparation
  title: string;
  learningObjective: string;
  skillsCovered: string[];
  practicalTask: string;
  completionCriteria: string;
  estimatedEffort: string;
}

export interface ICareer extends Document {
  title: string;
  slug: string;
  category: 'Software Development' | 'Cybersecurity and Cloud' | 'Data and Artificial Intelligence' | 'Design' | 'Business and Management';
  description: string;
  responsibilities: string[];
  requiredSkills: IRequiredSkill[];
  learningResources: ILearningResource[];
  portfolioProjects: IPortfolioProjectDef[];
  milestonesTemplate: IMilestoneTemplate[];
  preparationAdvice: string[];
  createdAt: Date;
  updatedAt: Date;
}

const RequiredSkillSchema = new Schema<IRequiredSkill>(
  {
    canonicalName: { type: String, required: true },
    normalizedName: { type: String, required: true },
    category: { type: String, required: true },
    targetLevel: { type: Number, required: true, min: 1, max: 5 },
    weight: { type: Number, required: true, min: 1, max: 3 },
    importance: { type: String, enum: ['Required', 'Important', 'Optional'], required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const LearningResourceSchema = new Schema<ILearningResource>(
  {
    title: { type: String, required: true },
    provider: { type: String, required: true },
    relatedSkills: { type: [String], default: [] },
    resourceType: {
      type: String,
      enum: ['Documentation', 'Course', 'Interactive', 'Guide', 'Book'],
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    estimatedHours: { type: Number, default: 10 },
    url: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const PortfolioProjectSchema = new Schema<IPortfolioProjectDef>(
  {
    projectId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true
    },
    estimatedHours: { type: Number, default: 20 },
    skillsDeveloped: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    completionCriteria: { type: [String], default: [] }
  },
  { _id: false }
);

const MilestoneTemplateSchema = new Schema<IMilestoneTemplate>(
  {
    stage: { type: Number, required: true },
    stageName: { type: String, required: true },
    title: { type: String, required: true },
    learningObjective: { type: String, required: true },
    skillsCovered: { type: [String], default: [] },
    practicalTask: { type: String, required: true },
    completionCriteria: { type: String, required: true },
    estimatedEffort: { type: String, required: true }
  },
  { _id: false }
);

const CareerSchema = new Schema<ICareer>(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Software Development',
        'Cybersecurity and Cloud',
        'Data and Artificial Intelligence',
        'Design',
        'Business and Management'
      ],
      index: true
    },
    description: { type: String, required: true },
    responsibilities: { type: [String], default: [] },
    requiredSkills: { type: [RequiredSkillSchema], default: [] },
    learningResources: { type: [LearningResourceSchema], default: [] },
    portfolioProjects: { type: [PortfolioProjectSchema], default: [] },
    milestonesTemplate: { type: [MilestoneTemplateSchema], default: [] },
    preparationAdvice: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

export const Career = mongoose.models.Career || mongoose.model<ICareer>('Career', CareerSchema);
