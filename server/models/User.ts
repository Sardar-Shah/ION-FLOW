import mongoose, { Document, Schema } from 'mongoose';

export interface IUserSkill {
  skillName: string;
  normalizedName: string;
  level: number; // 0 to 5
  source?: string; // e.g. "Coursework", "Self-taught", "Internship", "Project"
  evidence?: string; // e.g. "GitHub link, certificate, or coursework description"
  updatedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  degree?: string;
  educationLevel?: string; // 'Undergraduate', 'Postgraduate', 'Bootcamp / Self-paced', 'High School'
  currentSemester?: string;
  careerInterests: string[];
  preferredLearningPace?: 'accelerated' | 'moderate' | 'relaxed';
  assessedSkills: IUserSkill[];
  targetCareerId?: mongoose.Types.ObjectId;
  targetCareerSlug?: string;
  savedCareers: string[]; // slugs
  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>(
  {
    skillName: { type: String, required: true },
    normalizedName: { type: String, required: true },
    level: { type: Number, required: true, min: 0, max: 5, default: 0 },
    source: { type: String, default: '' },
    evidence: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    passwordHash: { type: String, required: true },
    degree: { type: String, default: 'Computer Science & Engineering' },
    educationLevel: { type: String, default: 'Undergraduate' },
    currentSemester: { type: String, default: 'Year 3, Semester 1' },
    careerInterests: { type: [String], default: [] },
    preferredLearningPace: {
      type: String,
      enum: ['accelerated', 'moderate', 'relaxed'],
      default: 'moderate'
    },
    assessedSkills: { type: [UserSkillSchema], default: [] },
    targetCareerId: { type: Schema.Types.ObjectId, ref: 'Career' },
    targetCareerSlug: { type: String, default: '' },
    savedCareers: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
