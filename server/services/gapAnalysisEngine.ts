import { ICareer, IRequiredSkill } from '../models/Career.ts';
import { IUserSkill } from '../models/User.ts';

export interface SkillComparisonResult {
  skillName: string;
  normalizedName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  weight: number;
  importance: 'Required' | 'Important' | 'Optional';
  completionRatio: number;
  status: 'met' | 'partial' | 'missing';
  gap: number;
}

export interface GapAnalysisResult {
  readinessScore: number;
  skillsMetCount: number;
  skillsPartialCount: number;
  skillsMissingCount: number;
  totalRequiredWeight: number;
  achievedWeightedScore: number;
  detailedSkills: SkillComparisonResult[];
  rankedGaps: SkillComparisonResult[];
  recommendedNextAction: string;
  priorityResources: any[];
  recommendedMilestones: any[];
  unassessedNote: string;
}

/**
 * Normalizes skill string for matching against canonical career requirements
 */
export function normalizeSkillName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Matches a user's assessed skill list against a required skill
 */
export function findMatchingUserSkill(
  requiredSkill: IRequiredSkill,
  userSkills: IUserSkill[]
): IUserSkill | undefined {
  const reqNorm = normalizeSkillName(requiredSkill.normalizedName || requiredSkill.canonicalName);
  const reqCanonicalNorm = normalizeSkillName(requiredSkill.canonicalName);

  return userSkills.find((us) => {
    const userNorm = normalizeSkillName(us.normalizedName || us.skillName);
    const userCanonicalNorm = normalizeSkillName(us.skillName);
    return (
      userNorm === reqNorm ||
      userCanonicalNorm === reqCanonicalNorm ||
      userNorm === reqCanonicalNorm ||
      userCanonicalNorm === reqNorm ||
      userNorm.includes(reqNorm) ||
      reqNorm.includes(userNorm)
    );
  });
}

export interface ICareerInput {
  title: string;
  slug: string;
  category?: string;
  requiredSkills: IRequiredSkill[];
  learningResources?: any[];
  milestonesTemplate?: any[];
}

/**
 * Computes deterministic skill-gap analysis and readiness score
 */
export function computeGapAnalysis(
  career: ICareerInput | ICareer,
  userSkills: IUserSkill[]
): GapAnalysisResult {
  const detailedSkills: SkillComparisonResult[] = [];
  let totalWeight = 0;
  let totalWeightedScore = 0;
  let missingCount = 0;
  let partialCount = 0;
  let metCount = 0;

  for (const req of career.requiredSkills) {
    const matched = findMatchingUserSkill(req, userSkills);
    const currentLevel = matched ? Math.min(5, Math.max(0, matched.level)) : 0;
    const targetLevel = Math.max(1, req.targetLevel);
    const weight = req.weight || (req.importance === 'Required' ? 3 : req.importance === 'Important' ? 2 : 1);

    // Formula: Skill completion = min(current level, target level) / target level
    const completionRatio = Math.min(currentLevel, targetLevel) / targetLevel;
    const weightedCompletion = completionRatio * weight;

    totalWeight += weight;
    totalWeightedScore += weightedCompletion;

    let status: 'met' | 'partial' | 'missing' = 'missing';
    if (currentLevel >= targetLevel) {
      status = 'met';
      metCount++;
    } else if (currentLevel > 0) {
      status = 'partial';
      partialCount++;
    } else {
      status = 'missing';
      missingCount++;
    }

    const gap = Math.max(0, targetLevel - currentLevel);

    detailedSkills.push({
      skillName: req.canonicalName,
      normalizedName: req.normalizedName,
      category: req.category,
      currentLevel,
      targetLevel,
      weight,
      importance: req.importance,
      completionRatio: Math.round(completionRatio * 100) / 100,
      status,
      gap
    });
  }

  // Formula: Readiness score = 100 * sum(skill completion * weight) / sum(all applicable skill weights)
  const readinessScore = totalWeight > 0 ? Math.round((100 * totalWeightedScore) / totalWeight) : 0;

  // Rank gaps by weight (highest priority first: 3 -> 2 -> 1), then by gap size descending
  const rankedGaps = detailedSkills
    .filter((s) => s.status !== 'met')
    .sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight;
      }
      return b.gap - a.gap;
    });

  // Determine top recommended next action
  let recommendedNextAction = 'All target skills for this career have reached proficient levels! Focus on your capstone portfolio project.';
  if (rankedGaps.length > 0) {
    const topGap = rankedGaps[0];
    if (topGap.status === 'missing') {
      recommendedNextAction = `Start foundational training in ${topGap.skillName} (${topGap.importance} requirement, target Level ${topGap.targetLevel}).`;
    } else {
      recommendedNextAction = `Advance ${topGap.skillName} from Level ${topGap.currentLevel} to target Level ${topGap.targetLevel} via targeted practical exercises.`;
    }
  }

  // Find relevant learning resources targeting top gaps
  const topGapNames = rankedGaps.slice(0, 3).map((g) => g.skillName.toLowerCase());
  const priorityResources = (career.learningResources || []).filter((res) => {
    return (res.relatedSkills || []).some((rs: string) =>
      topGapNames.some((tgn) => tgn.includes(rs.toLowerCase()) || rs.toLowerCase().includes(tgn))
    );
  });

  const recommendedMilestones = (career.milestonesTemplate || []).slice(0, 3);

  return {
    readinessScore: Math.min(100, Math.max(0, readinessScore)),
    skillsMetCount: metCount,
    skillsPartialCount: partialCount,
    skillsMissingCount: missingCount,
    totalRequiredWeight: totalWeight,
    achievedWeightedScore: Math.round(totalWeightedScore * 10) / 10,
    detailedSkills,
    rankedGaps,
    recommendedNextAction,
    priorityResources: priorityResources.length > 0 ? priorityResources : (career.learningResources || []).slice(0, 3),
    recommendedMilestones,
    unassessedNote:
      missingCount > 0
        ? `${missingCount} required skills have not been assessed or have level 0 experience. They are counted as 0 in this calculation.`
        : 'All required skills have been assessed.'
  };
}
