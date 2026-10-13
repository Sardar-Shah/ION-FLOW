import { IRoadmapStage, IRoadmapMilestone } from '../models/Roadmap.ts';
import { IExtractedSkill } from '../models/ResumeProfile.ts';
import { IRoleRequirementSkill } from '../models/TargetRole.ts';

export class FiveStageRoadmapService {
  /**
   * Generates or personalizes exactly 5 stages for any target role, tailored to student gaps
   */
  static generateFiveStageRoadmap(params: {
    targetRoleTitle: string;
    studentSkills: IExtractedSkill[];
    requiredSkills: IRoleRequirementSkill[];
    existingStages?: IRoadmapStage[];
  }): {
    stages: IRoadmapStage[];
    totalMilestones: number;
    completedMilestones: number;
    progressPercentage: number;
  } {
    const { targetRoleTitle, studentSkills, requiredSkills, existingStages } = params;

    const studentSkillMap = new Map<string, IExtractedSkill>();
    studentSkills.forEach((s) => studentSkillMap.set(s.name.toLowerCase(), s));

    // Identify gaps vs demonstrated
    const verifiedSkills: string[] = [];
    const missingOrGapSkills: string[] = [];

    requiredSkills.forEach((req) => {
      const match = studentSkillMap.get(req.name.toLowerCase());
      if (match && match.confidence === 'demonstrated' && match.level >= req.minLevel) {
        verifiedSkills.push(req.name);
      } else {
        missingOrGapSkills.push(req.name);
      }
    });

    const primaryGaps = missingOrGapSkills.slice(0, 4);
    const secondaryGaps = missingOrGapSkills.slice(4, 8);

    // Build map of previous milestone statuses if existing
    const previousStatusMap = new Map<string, { status: 'not_started' | 'in_progress' | 'completed'; completedAt?: Date }>();
    if (existingStages && existingStages.length > 0) {
      existingStages.forEach((st) => {
        st.milestones.forEach((m) => {
          previousStatusMap.set(m.milestoneId, { status: m.status, completedAt: m.completedAt });
          previousStatusMap.set(m.title.toLowerCase(), { status: m.status, completedAt: m.completedAt });
        });
      });
    }

    const stageDefinitions = [
      {
        stageNumber: 1,
        stageName: 'Stage 1: Foundation and Baseline',
        milestones: [
          {
            title: `Audit Baseline Proficiency & Workspace Setup for ${targetRoleTitle}`,
            objective: `Establish a professional developer environment with linting, version control conventions, and review existing ${verifiedSkills.slice(0, 2).join(' & ') || 'foundations'}.`,
            skillsCovered: verifiedSkills.length > 0 ? verifiedSkills.slice(0, 2) : ['Git & Version Control', 'Core Syntax'],
            practicalTask: `Configure standardized editor tooling, pre-commit hooks, and complete baseline diagnostic exercises in ${verifiedSkills[0] || 'core tools'}.`,
            criteria: 'Clean git commits verified, linting passes with zero warnings, and diagnostic exercises compile successfully.',
            effort: '6 - 10 Hours',
            isGap: false
          },
          {
            title: `Foundational Ramp-Up: ${primaryGaps[0] || 'Core Role Concepts'}`,
            objective: `Address essential foundational principles in ${primaryGaps[0] || 'fundamental architecture'} required for subsequent stages.`,
            skillsCovered: [primaryGaps[0] || 'Core Syntax'],
            practicalTask: `Complete guided tutorials and build 3 isolated code modules exploring ${primaryGaps[0] || 'baseline patterns'}.`,
            criteria: 'All module exercises pass automated tests with comprehensive comments.',
            effort: '10 - 14 Hours',
            isGap: true
          }
        ]
      },
      {
        stageNumber: 2,
        stageName: 'Stage 2: Core Skill Development',
        milestones: [
          {
            title: `Role-Specific Architecture Mastery: ${primaryGaps.slice(0, 2).join(' & ') || 'Core Frameworks'}`,
            objective: `Deepen practical knowledge in the primary technologies employers expect for ${targetRoleTitle}.`,
            skillsCovered: primaryGaps.slice(0, 2),
            practicalTask: `Implement modular services with clean separation of concerns, error handling, and type safety in ${primaryGaps[0] || 'main framework'}.`,
            criteria: 'Services demonstrate clean abstractions and handle typical boundary error conditions gracefully.',
            effort: '15 - 20 Hours',
            isGap: true
          },
          {
            title: `Data Persistence & API Protocols: ${primaryGaps[1] || secondaryGaps[0] || 'Persistent Storage'}`,
            objective: `Master secure communication protocols, schema design, and asynchronous data operations.`,
            skillsCovered: [primaryGaps[1] || secondaryGaps[0] || 'RESTful APIs'],
            practicalTask: `Create persistent data models, write efficient queries, and expose RESTful endpoints with input validation.`,
            criteria: 'Endpoints return proper HTTP status codes, data validations reject malformed payloads, and queries are indexed.',
            effort: '14 - 18 Hours',
            isGap: true
          }
        ]
      },
      {
        stageNumber: 3,
        stageName: 'Stage 3: Applied Practice',
        milestones: [
          {
            title: `Realistic Business Constraints: Testing, Edge Cases & Performance`,
            objective: `Simulate real-world enterprise engineering conditions including automated test suites, caching, and rate limiting.`,
            skillsCovered: ['Automated Testing (Unit/E2E)', primaryGaps[0] || 'System Design'],
            practicalTask: `Write unit and integration tests achieving >80% code coverage across critical service paths.`,
            criteria: 'Test suite runs in CI, mocking external dependencies and asserting expected edge case behavior.',
            effort: '16 - 22 Hours',
            isGap: false
          },
          {
            title: `Multi-Service Integration & Cloud Deployment Practice`,
            objective: `Containerize and orchestrate services using modern cloud workflows.`,
            skillsCovered: ['Docker', 'CI/CD Pipelines'],
            practicalTask: `Create a multi-stage Dockerfile, automated GitHub Actions workflow, and deploy to a cloud container runtime.`,
            criteria: 'Container builds without unnecessary dependencies, and automated pipeline passes all verification checks.',
            effort: '12 - 16 Hours',
            isGap: false
          }
        ]
      },
      {
        stageNumber: 4,
        stageName: 'Stage 4: Portfolio and Real-World Projects',
        milestones: [
          {
            title: `Production Capstone Project for ${targetRoleTitle}`,
            objective: `Design and deliver an impressive, full-featured project directly showcasing your readiness to hiring managers.`,
            skillsCovered: [...primaryGaps, ...secondaryGaps].slice(0, 4),
            practicalTask: `Build a showcase application solving a realistic domain challenge, incorporating live data, secure auth, and responsive UI.`,
            criteria: 'Application is deployed with a live URL, clean README, architecture diagrams, and test suite.',
            effort: '30 - 45 Hours',
            isGap: true
          },
          {
            title: `Open-Source Contribution or Technical Case Study`,
            objective: `Demonstrate code communication, architectural trade-offs, and collaborative readiness.`,
            skillsCovered: ['Technical Communication', 'System Design & Architecture'],
            practicalTask: `Document system architecture, benchmark bottlenecks, and write a technical case study detailing key engineering decisions.`,
            criteria: 'Case study clearly explains problem, alternatives considered, chosen design, and performance metrics.',
            effort: '10 - 15 Hours',
            isGap: false
          }
        ]
      },
      {
        stageNumber: 5,
        stageName: 'Stage 5: Readiness Verification and Career Launch',
        milestones: [
          {
            title: `Technical Verification Rubrics & Scenario Assessments`,
            objective: `Validate verified mastery through technical quiz checks and project rubric evaluations.`,
            skillsCovered: requiredSkills.slice(0, 4).map((s) => s.name),
            practicalTask: `Complete CareerPath AI readiness assessments and attach verified repository links to your profile.`,
            criteria: 'All core readiness quizzes passed with score >=80% and project links validated.',
            effort: '8 - 12 Hours',
            isGap: false
          },
          {
            title: `Resume Alignment & Technical Interview Preparation`,
            objective: `Translate acquired project evidence into quantified resume accomplishments and prepare behavioral/technical stories.`,
            skillsCovered: ['Technical Communication', 'Agile & Scrum'],
            practicalTask: `Update resume with bullet points detailing metrics, tools, and outcomes from Stages 3 and 4; conduct mock technical interviews.`,
            criteria: 'Resume updated with verified project deliverables, and STAR stories prepared for each major project.',
            effort: '6 - 10 Hours',
            isGap: false
          }
        ]
      }
    ];

    let totalMilestones = 0;
    let completedMilestones = 0;

    const stages: IRoadmapStage[] = stageDefinitions.map((sDef) => {
      const milestones: IRoadmapMilestone[] = sDef.milestones.map((mDef, mIdx) => {
        totalMilestones++;
        const milestoneId = `stage-${sDef.stageNumber}-m${mIdx + 1}`;

        // Preserve previous status if student had completed it!
        const prev = previousStatusMap.get(milestoneId) || previousStatusMap.get(mDef.title.toLowerCase());
        const status = prev ? prev.status : 'not_started';
        const completedAt = prev ? prev.completedAt : undefined;

        if (status === 'completed') {
          completedMilestones++;
        }

        return {
          milestoneId,
          title: mDef.title,
          learningObjective: mDef.objective,
          skillsCovered: mDef.skillsCovered,
          practicalTask: mDef.practicalTask,
          completionCriteria: mDef.criteria,
          estimatedEffort: mDef.effort,
          status,
          isGapTargeted: mDef.isGap,
          completedAt
        };
      });

      return {
        stageNumber: sDef.stageNumber,
        stageName: sDef.stageName,
        milestones
      };
    });

    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    return {
      stages,
      totalMilestones,
      completedMilestones,
      progressPercentage
    };
  }
}
