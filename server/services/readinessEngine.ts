import { IExtractedSkill } from '../models/ResumeProfile.ts';
import { IRoleRequirementSkill } from '../models/TargetRole.ts';

export interface ISkillAnalysisResult {
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  importance: 'Required' | 'Important' | 'Optional';
  weight: number;
  status: 'demonstrated' | 'partial' | 'unconfirmed' | 'missing';
  evidence: string;
  confidence: 'demonstrated' | 'partially_demonstrated' | 'inferred' | 'none';
  gapSeverity: 'None' | 'Low' | 'Medium' | 'High';
  recommendedNextAction: string;
}

export interface IReadinessEvaluation {
  readinessScore: number; // 0 to 100
  assessmentCoveragePercent: number; // 0 to 100
  demonstratedCount: number;
  partialCount: number;
  unconfirmedCount: number;
  missingCount: number;
  totalRequiredWeight: number;
  achievedWeightedScore: number;
  detailedSkills: ISkillAnalysisResult[];
  topGaps: ISkillAnalysisResult[];
  recommendedNextAction: string;
  evidenceBonusScore: number;
  isEducationalIndicator: true;
}

export class ReadinessEngineService {
  /**
   * Computes an explainable educational readiness score
   */
  static evaluateReadiness(params: {
    studentSkills: IExtractedSkill[];
    roleRequirements: {
      mandatory: IRoleRequirementSkill[];
      important: IRoleRequirementSkill[];
      preferred: IRoleRequirementSkill[];
    };
    verifiedProjectsCount?: number;
    quizzesPassedCount?: number;
  }): IReadinessEvaluation {
    const { studentSkills, roleRequirements, verifiedProjectsCount = 0, quizzesPassedCount = 0 } = params;

    const allRequirements: IRoleRequirementSkill[] = [
      ...roleRequirements.mandatory.map((m) => ({ ...m, importance: 'Required' as const, weight: 3 })),
      ...roleRequirements.important.map((i) => ({ ...i, importance: 'Important' as const, weight: 2 })),
      ...roleRequirements.preferred.map((p) => ({ ...p, importance: 'Optional' as const, weight: 1 }))
    ];

    const studentSkillMap = new Map<string, IExtractedSkill>();
    studentSkills.forEach((s) => {
      studentSkillMap.set(s.name.toLowerCase(), s);
    });

    let totalWeight = 0;
    let achievedWeight = 0;
    let assessedCount = 0;

    let demonstratedCount = 0;
    let partialCount = 0;
    let unconfirmedCount = 0;
    let missingCount = 0;

    const detailedSkills: ISkillAnalysisResult[] = allRequirements.map((req) => {
      totalWeight += req.weight;

      const studentSkill = studentSkillMap.get(req.name.toLowerCase());
      const currentLevel = studentSkill ? studentSkill.level : 0;
      const targetLevel = req.minLevel || 3;
      const evidence = studentSkill?.evidence || 'No direct evidence identified in submitted resume.';
      const confidence = studentSkill?.confidence || 'none';

      let status: 'demonstrated' | 'partial' | 'unconfirmed' | 'missing' = 'missing';
      let gapSeverity: 'None' | 'Low' | 'Medium' | 'High' = 'High';
      let nextAction = `Complete introductory module and practical exercises for ${req.name}.`;

      if (studentSkill) {
        assessedCount++;
        if (studentSkill.confidence === 'demonstrated' && currentLevel >= targetLevel) {
          status = 'demonstrated';
          gapSeverity = 'None';
          achievedWeight += req.weight * 1.0;
          demonstratedCount++;
          nextAction = `Validated in resume. Keep skills current by demonstrating in capstone project.`;
        } else if (studentSkill.confidence === 'demonstrated' && currentLevel < targetLevel) {
          status = 'partial';
          gapSeverity = 'Low';
          const ratio = Math.max(0.4, currentLevel / targetLevel);
          achievedWeight += req.weight * ratio;
          partialCount++;
          nextAction = `Evidence shows foundational exposure. Deepen practical mastery to reach target level ${targetLevel}/5.`;
        } else if (studentSkill.confidence === 'partially_demonstrated' || studentSkill.confidence === 'inferred') {
          status = 'unconfirmed';
          gapSeverity = req.importance === 'Required' ? 'Medium' : 'Low';
          achievedWeight += req.weight * 0.5;
          unconfirmedCount++;
          nextAction = `Reported in resume skills. Complete verification quiz or attach project link to confirm competency.`;
        }
      } else {
        missingCount++;
        gapSeverity = req.importance === 'Required' ? 'High' : req.importance === 'Important' ? 'Medium' : 'Low';
        nextAction = `Identified key gap. Add to learning roadmap Stage 1 or Stage 2.`;
      }

      return {
        skillName: req.name,
        category: req.category,
        currentLevel,
        targetLevel,
        importance: req.importance,
        weight: req.weight,
        status,
        evidence,
        confidence,
        gapSeverity,
        recommendedNextAction: nextAction
      };
    });

    // Baseline base score
    let baseScore = totalWeight > 0 ? (achievedWeight / totalWeight) * 100 : 50;

    // Practical evidence bonus (up to +15% for completed verified projects and passed quizzes)
    const evidenceBonusScore = Math.min(15, verifiedProjectsCount * 5 + quizzesPassedCount * 3);
    const finalScore = Math.round(Math.min(99, Math.max(15, baseScore + evidenceBonusScore)));

    const assessmentCoveragePercent = allRequirements.length > 0 ? Math.round((assessedCount / allRequirements.length) * 100) : 100;

    // Filter top gaps sorted by importance & weight
    const topGaps = detailedSkills
      .filter((s) => s.status !== 'demonstrated')
      .sort((a, b) => b.weight - a.weight);

    let recommendedNextAction = 'Continue your personalized 5-Stage Roadmap.';
    if (topGaps.length > 0) {
      const topGap = topGaps[0];
      recommendedNextAction = `Focus on ${topGap.skillName} (${topGap.importance}): ${topGap.recommendedNextAction}`;
    } else {
      recommendedNextAction = `Exceptional readiness. Proceed to Stage 4 portfolio projects and Stage 5 career launch preparation.`;
    }

    return {
      readinessScore: finalScore,
      assessmentCoveragePercent,
      demonstratedCount,
      partialCount,
      unconfirmedCount,
      missingCount,
      totalRequiredWeight: totalWeight,
      achievedWeightedScore: Math.round(achievedWeight),
      detailedSkills,
      topGaps: topGaps.slice(0, 5),
      recommendedNextAction,
      evidenceBonusScore,
      isEducationalIndicator: true
    };
  }
}
