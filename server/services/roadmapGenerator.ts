import { ICareer } from '../models/Career.ts';
import { IUserSkill } from '../models/User.ts';
import { GapAnalysisResult, computeGapAnalysis, ICareerInput } from './gapAnalysisEngine.ts';
import { IRoadmapStage, IRoadmapMilestone } from '../models/Roadmap.ts';

export function generatePersonalizedRoadmap(
  career: ICareer | ICareerInput,
  userSkills: IUserSkill[],
  existingMilestonesState?: Map<string, 'not_started' | 'in_progress' | 'completed'>
): {
  stages: IRoadmapStage[];
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
  gapAnalysis: GapAnalysisResult;
} {
  const gapAnalysis = computeGapAnalysis(career, userSkills);
  const gapSkillNames = new Set(gapAnalysis.rankedGaps.map((g) => g.skillName.toLowerCase()));

  // Map career template into 5 distinct stages
  const stageDefinitions = [
    { number: 1, name: '1. Foundations' },
    { number: 2, name: '2. Core Skills' },
    { number: 3, name: '3. Practical Application' },
    { number: 4, name: '4. Portfolio Development' },
    { number: 5, name: '5. Career Preparation' }
  ];

  const stages: IRoadmapStage[] = [];
  let totalMilestones = 0;
  let completedMilestones = 0;

  for (const def of stageDefinitions) {
    const templateMilestones = (career.milestonesTemplate || []).filter(
      (m) => m.stage === def.number || (def.number === 1 && m.stage === undefined)
    );

    const stageMilestones: IRoadmapMilestone[] = [];

    if (templateMilestones.length > 0) {
      for (let i = 0; i < templateMilestones.length; i++) {
        const tm = templateMilestones[i];
        const milestoneId = `${career.slug}-s${def.number}-m${i + 1}`;
        const previousStatus = existingMilestonesState?.get(milestoneId) || 'not_started';

        const isGapTargeted = (tm.skillsCovered || []).some((sc: string) =>
          gapSkillNames.has(sc.toLowerCase())
        );

        const milestone: IRoadmapMilestone = {
          milestoneId,
          title: tm.title,
          learningObjective: tm.learningObjective,
          skillsCovered: tm.skillsCovered,
          practicalTask: tm.practicalTask,
          completionCriteria: tm.completionCriteria,
          estimatedEffort: tm.estimatedEffort,
          status: previousStatus,
          isGapTargeted
        };

        if (previousStatus === 'completed') {
          completedMilestones++;
        }
        totalMilestones++;
        stageMilestones.push(milestone);
      }
    } else {
      // Fallback stage generation tailored to career
      const milestoneId = `${career.slug}-s${def.number}-m1`;
      const previousStatus = existingMilestonesState?.get(milestoneId) || 'not_started';
      const stageMilestone: IRoadmapMilestone = {
        milestoneId,
        title: `${career.title} ${def.name.split('. ')[1]} Mastery`,
        learningObjective: `Achieve mastery in ${career.title} domain competencies for ${def.name}.`,
        skillsCovered: career.requiredSkills.slice(0, 2).map((s) => s.canonicalName),
        practicalTask: `Complete designated practical project task for ${career.title}.`,
        completionCriteria: `Verified completion of standard deliverables.`,
        estimatedEffort: '20 hours',
        status: previousStatus,
        isGapTargeted: true
      };
      if (previousStatus === 'completed') completedMilestones++;
      totalMilestones++;
      stageMilestones.push(stageMilestone);
    }

    stages.push({
      stageNumber: def.number,
      stageName: def.name,
      milestones: stageMilestones
    });
  }

  const progressPercentage =
    totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return {
    stages,
    totalMilestones,
    completedMilestones,
    progressPercentage,
    gapAnalysis
  };
}
