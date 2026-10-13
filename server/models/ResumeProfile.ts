import mongoose, { Document, Schema } from 'mongoose';

export interface IExtractedSkill {
  name: string;
  category: string;
  level: number; // 1 to 5
  evidence: string;
  confidence: 'demonstrated' | 'partially_demonstrated' | 'inferred';
  sourceSection: string;
  isCustomAdded?: boolean;
}

export interface IEducationItem {
  school: string;
  degree: string;
  year?: string;
  gpa?: string;
  coursework?: string[];
}

export interface IExperienceItem {
  role: string;
  company: string;
  duration?: string;
  highlights: string[];
}

export interface IProjectItem {
  title: string;
  techStack: string[];
  description: string;
  highlights: string[];
  link?: string;
}

export interface ICertificationItem {
  name: string;
  issuer?: string;
  year?: string;
}

export interface ICareerRecommendation {
  title: string;
  slug: string;
  category: string;
  matchScore: number; // 0 to 100
  whyItFits: string;
  relevantSkills: string[];
  unverifiedCapabilities: string[];
  developmentGaps: string[];
  recommendedNextAction: string;
  benchmarkSlug?: string;
}

export interface IResumeProfile extends Document {
  userId?: mongoose.Types.ObjectId;
  guestId?: string;
  rawText: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'pasted';
  fileSize?: number;
  personalInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    github?: string;
    linkedin?: string;
  };
  education: IEducationItem[];
  skills: IExtractedSkill[];
  experience: IExperienceItem[];
  projects: IProjectItem[];
  certifications: ICertificationItem[];
  toolsAndTech: string[];
  transferableSkills: string[];
  strengths: string[];
  recommendedCareers: ICareerRecommendation[];
  isReviewed: boolean;
  aiAnalysisStatus: 'enhanced_by_gemini' | 'deterministic_parser' | 'error_fallback';
  aiAnalysisMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExtractedSkillSchema = new Schema<IExtractedSkill>(
  {
    name: { type: String, required: true },
    category: { type: String, default: 'General Technical' },
    level: { type: Number, required: true, min: 1, max: 5, default: 3 },
    evidence: { type: String, default: '' },
    confidence: {
      type: String,
      enum: ['demonstrated', 'partially_demonstrated', 'inferred'],
      default: 'inferred'
    },
    sourceSection: { type: String, default: 'Skills' },
    isCustomAdded: { type: Boolean, default: false }
  },
  { _id: false }
);

const ResumeProfileSchema = new Schema<IResumeProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    guestId: { type: String, index: true },
    rawText: { type: String, required: true },
    fileName: { type: String, default: 'resume.txt' },
    fileType: { type: String, enum: ['pdf', 'docx', 'txt', 'pasted'], default: 'pasted' },
    fileSize: { type: Number, default: 0 },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' }
    },
    education: [
      {
        school: { type: String, default: '' },
        degree: { type: String, default: '' },
        year: { type: String, default: '' },
        gpa: { type: String, default: '' },
        coursework: { type: [String], default: [] }
      }
    ],
    skills: { type: [ExtractedSkillSchema], default: [] },
    experience: [
      {
        role: { type: String, default: '' },
        company: { type: String, default: '' },
        duration: { type: String, default: '' },
        highlights: { type: [String], default: [] }
      }
    ],
    projects: [
      {
        title: { type: String, default: '' },
        techStack: { type: [String], default: [] },
        description: { type: String, default: '' },
        highlights: { type: [String], default: [] },
        link: { type: String, default: '' }
      }
    ],
    certifications: [
      {
        name: { type: String, default: '' },
        issuer: { type: String, default: '' },
        year: { type: String, default: '' }
      }
    ],
    toolsAndTech: { type: [String], default: [] },
    transferableSkills: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    recommendedCareers: [
      {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        category: { type: String, default: 'Software Engineering' },
        matchScore: { type: Number, default: 75 },
        whyItFits: { type: String, default: '' },
        relevantSkills: { type: [String], default: [] },
        unverifiedCapabilities: { type: [String], default: [] },
        developmentGaps: { type: [String], default: [] },
        recommendedNextAction: { type: String, default: '' },
        benchmarkSlug: { type: String }
      }
    ],
    isReviewed: { type: Boolean, default: false },
    aiAnalysisStatus: {
      type: String,
      enum: ['enhanced_by_gemini', 'deterministic_parser', 'error_fallback'],
      default: 'deterministic_parser'
    },
    aiAnalysisMessage: { type: String, default: '' }
  },
  { timestamps: true }
);

export const ResumeProfile = mongoose.model<IResumeProfile>('ResumeProfile', ResumeProfileSchema);
