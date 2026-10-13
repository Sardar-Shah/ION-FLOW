import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  canonicalName: string;
  normalizedName: string;
  category: string;
  description: string;
  aliases: string[];
}

const SkillSchema = new Schema<ISkill>(
  {
    canonicalName: { type: String, required: true, unique: true },
    normalizedName: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    aliases: { type: [String], default: [] }
  },
  {
    timestamps: true
  }
);

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
