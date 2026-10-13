import { SKILL_TAXONOMY } from './resumeParser.ts';
import { IRoleRequirementSkill, IReadinessQuizQuestion } from '../models/TargetRole.ts';
import { IMilestoneTemplate, IPortfolioProjectDef, ILearningResource } from '../models/Career.ts';

export class JobDescriptionParserService {
  /**
   * Parses an actual job description into structured requirements and educational milestones
   */
  static parseJobDescription(jobText: string, jobTitle: string = 'Target Role'): {
    title: string;
    slug: string;
    category: string;
    description: string;
    isProvisionalBenchmark: boolean;
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
  } {
    const textLower = jobText.toLowerCase();

    // Determine Seniority
    let seniority = 'Entry-Level / Graduate';
    if (/\b(?:senior|lead|principal|staff|architect)\b/i.test(jobText)) {
      seniority = 'Senior Level';
    } else if (/\b(?:mid-level|intermediate|2-4 years|3\+ years)\b/i.test(jobText)) {
      seniority = 'Mid-Level';
    } else if (/\b(?:intern|internship|apprentice|co-op)\b/i.test(jobText)) {
      seniority = 'Internship';
    }

    // Split job description into sections
    const lines = jobText.split('\n').map((l) => l.trim()).filter(Boolean);
    const requiredKeywords = ['requirements', 'required', 'qualifications', 'what you need', 'must have', 'minimum qualifications'];
    const preferredKeywords = ['preferred', 'nice to have', 'bonus', 'desired', 'plus', 'preferred qualifications'];
    const responsibilitiesKeywords = ['responsibilities', 'what you will do', 'duties', 'the role'];

    let currentSection = 'general';
    const sectionTexts: { required: string[]; preferred: string[]; responsibilities: string[]; general: string[] } = {
      required: [],
      preferred: [],
      responsibilities: [],
      general: []
    };

    lines.forEach((line) => {
      const lineLower = line.toLowerCase();
      if (requiredKeywords.some((k) => lineLower.includes(k)) && line.length < 50) {
        currentSection = 'required';
      } else if (preferredKeywords.some((k) => lineLower.includes(k)) && line.length < 50) {
        currentSection = 'preferred';
      } else if (responsibilitiesKeywords.some((k) => lineLower.includes(k)) && line.length < 50) {
        currentSection = 'responsibilities';
      } else {
        (sectionTexts as any)[currentSection].push(line);
      }
    });

    const requiredStr = sectionTexts.required.join(' ');
    const preferredStr = sectionTexts.preferred.join(' ');
    const fullStr = jobText;

    const mandatorySkills: IRoleRequirementSkill[] = [];
    const importantSkills: IRoleRequirementSkill[] = [];
    const preferredSkills: IRoleRequirementSkill[] = [];
    const detectedTools: string[] = [];

    // Match skills against taxonomy
    SKILL_TAXONOMY.forEach((st) => {
      const inRequired = st.patterns.some((p) => p.test(requiredStr));
      const inPreferred = st.patterns.some((p) => p.test(preferredStr));
      const inFull = st.patterns.some((p) => p.test(fullStr));

      if (inRequired) {
        mandatorySkills.push({
          name: st.canonicalName,
          category: st.category,
          minLevel: 3,
          importance: 'Required',
          weight: 3,
          reason: 'Explicitly listed in job posting minimum qualifications'
        });
        detectedTools.push(st.canonicalName);
      } else if (inPreferred) {
        preferredSkills.push({
          name: st.canonicalName,
          category: st.category,
          minLevel: 2,
          importance: 'Optional',
          weight: 1,
          reason: 'Listed as preferred / nice-to-have qualification'
        });
        detectedTools.push(st.canonicalName);
      } else if (inFull) {
        importantSkills.push({
          name: st.canonicalName,
          category: st.category,
          minLevel: 3,
          importance: 'Important',
          weight: 2,
          reason: 'Mentioned in role responsibilities or technology overview'
        });
        detectedTools.push(st.canonicalName);
      }
    });

    // If requirements were sparse, provide standard engineering baseline
    if (mandatorySkills.length === 0) {
      mandatorySkills.push(
        { name: 'Git & Version Control', category: 'Developer Tools', minLevel: 3, importance: 'Required', weight: 3, reason: 'Essential collaborative engineering baseline' },
        { name: 'RESTful APIs', category: 'Backend', minLevel: 3, importance: 'Required', weight: 3, reason: 'Core client-server communication foundation' }
      );
    }

    // Extract practical capabilities
    const practicalCapabilities: string[] = [
      'Write modular, well-tested code compliant with team standards',
      'Deploy and verify changes across staging/production environments',
      'Collaborate via code reviews and sprint retrospective rituals'
    ];
    if (mandatorySkills.some((s) => s.category === 'Frontend')) {
      practicalCapabilities.push('Build accessible, responsive UI workflows connected to live backend APIs');
    }
    if (mandatorySkills.some((s) => s.category === 'Databases')) {
      practicalCapabilities.push('Design normalized data schemas and optimize database query indexing');
    }
    if (mandatorySkills.some((s) => s.category === 'Cloud & DevOps')) {
      practicalCapabilities.push('Configure containerized build pipelines and automated deployment manifests');
    }

    const slug = jobTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Category inference
    let category = 'Software Development';
    if (textLower.includes('cyber') || textLower.includes('security') || textLower.includes('penetration') || textLower.includes('soc')) {
      category = 'Cybersecurity and Cloud';
    } else if (textLower.includes('machine learning') || textLower.includes('ai') || textLower.includes('data engineer') || textLower.includes('data science')) {
      category = 'Data and Artificial Intelligence';
    } else if (textLower.includes('devops') || textLower.includes('cloud') || textLower.includes('sre') || textLower.includes('infrastructure')) {
      category = 'Cybersecurity and Cloud';
    }

    const topSkills = [...mandatorySkills, ...importantSkills].slice(0, 5).map((s) => s.name);

    // Learning Resources
    const learningResources: ILearningResource[] = topSkills.map((skill) => ({
      title: `Official ${skill} Documentation & Engineering Patterns`,
      provider: 'Industry Technical Guides',
      relatedSkills: [skill],
      resourceType: 'Documentation',
      difficulty: 'Intermediate',
      estimatedHours: 8,
      url: `https://developer.mozilla.org/`,
      description: `Comprehensive reference and deep-dive architectural exercises for ${skill}.`
    }));

    // Five-Stage Milestones (EXACTLY 5 STAGES!)
    const milestonesTemplate: IMilestoneTemplate[] = [
      {
        stage: 1,
        stageName: 'Foundation and Baseline',
        title: `Establish Core Technical Foundations for ${jobTitle}`,
        learningObjective: `Verify existing baseline syntax, version control, and core principles in ${topSkills.slice(0, 2).join(' and ') || 'Computer Science'}.`,
        skillsCovered: topSkills.slice(0, 2),
        practicalTask: `Set up a standardized developer workspace and complete diagnostic exercises demonstrating proficiency in ${topSkills[0] || 'core tools'}.`,
        completionCriteria: 'Workspace passes linting, automated unit test suites execute without errors, and foundational git commits follow conventional style.',
        estimatedEffort: '10 - 15 Hours'
      },
      {
        stage: 2,
        stageName: 'Core Skill Development',
        title: `Role-Specific Architecture & Framework Mastery`,
        learningObjective: `Implement fundamental service patterns, data manipulation, and APIs expected by employers hiring for ${jobTitle}.`,
        skillsCovered: topSkills.slice(1, 4),
        practicalTask: `Build functional micro-modules incorporating ${topSkills.slice(1, 3).join(', ') || 'essential frameworks'} with secure error handling.`,
        completionCriteria: 'Modular components pass comprehensive integration tests and cleanly separate presentation from business logic.',
        estimatedEffort: '18 - 25 Hours'
      },
      {
        stage: 3,
        stageName: 'Applied Practice',
        title: `Real-World Workflows, Testing & Integration`,
        learningObjective: `Apply acquired capabilities in realistic simulated business constraints including validation, caching, and database transactions.`,
        skillsCovered: topSkills.slice(2, 5),
        practicalTask: `Develop an end-to-end subsystem connecting persistent storage with secure endpoints, validated against real-world test fixtures.`,
        completionCriteria: 'Test coverage exceeds 80%, API edge cases return clean status codes, and database queries are indexed.',
        estimatedEffort: '20 - 30 Hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio and Real-World Projects',
        title: `Capstone Production Project for ${jobTitle}`,
        learningObjective: `Build a showcase-grade portfolio application directly satisfying the hiring requirements of this role.`,
        skillsCovered: topSkills,
        practicalTask: `Architect, containerize, and deploy a production-ready application featuring clean README documentation, architecture diagrams, and live demo link.`,
        completionCriteria: 'Public GitHub repository has meaningful commit history, clean setup instructions, containerized deployment, and verified live preview.',
        estimatedEffort: '35 - 45 Hours'
      },
      {
        stage: 5,
        stageName: 'Readiness Verification and Career Launch',
        title: `Verification Rubrics, Mock Technical Reviews & Launch`,
        learningObjective: `Audit skill mastery, complete scenario-based verification checks, prepare technical interview talking points, and launch application.`,
        skillsCovered: topSkills,
        practicalTask: `Complete readiness quiz evaluations, document architectural tradeoffs made during portfolio development, and refine resume bullet points with quantified impact.`,
        completionCriteria: 'All 5 stage verification checks completed with evidence links submitted to portfolio dashboard.',
        estimatedEffort: '15 - 20 Hours'
      }
    ];

    // Portfolio Projects
    const portfolioProjects: IPortfolioProjectDef[] = [
      {
        projectId: `proj-${slug}-capstone`,
        title: `${jobTitle} End-to-End Production Showcase`,
        description: `Comprehensive real-world project demonstrating ${topSkills.slice(0, 3).join(', ')} under realistic operational requirements.`,
        difficulty: 'Advanced',
        estimatedHours: 35,
        skillsDeveloped: topSkills.slice(0, 4),
        deliverables: ['Modular codebase with automated tests', 'Live deployed instance with SSL', 'Comprehensive GitHub documentation with architecture diagram'],
        completionCriteria: ['All mandatory role requirements demonstrated', 'Repository contains clean commit history and unit test suite']
      },
      {
        projectId: `proj-${slug}-utility`,
        title: `Targeted Technical Module: ${topSkills[0] || 'Core Skill'} Integration`,
        description: `Focused project demonstrating mastery of ${topSkills[0] || 'the primary technical requirement'} in isolation.`,
        difficulty: 'Intermediate',
        estimatedHours: 15,
        skillsDeveloped: [topSkills[0] || 'Core Skill'],
        deliverables: ['Working source code', 'Benchmark or test suite verifying reliability'],
        completionCriteria: ['Code demonstrates clean design patterns and exception handling']
      }
    ];

    // Readiness Quizzes
    const readinessQuizzes: IReadinessQuizQuestion[] = topSkills.slice(0, 3).map((skill, idx) => ({
      quizId: `quiz-${slug}-${idx}`,
      skillName: skill,
      question: `In a production ${jobTitle} environment, how should you best ensure reliability and maintainability when working with ${skill}?`,
      options: [
        `Write comprehensive automated tests, enforce static type checking, and handle edge cases gracefully`,
        `Rely exclusively on manual testing right before deployment to production`,
        `Disable logging and error boundaries to maximize raw throughput`,
        `Hardcode credentials and configuration values directly inside component files`
      ],
      correctAnswer: 0,
      explanation: `Robust engineering standards in modern ${jobTitle} teams prioritize automated testing, type safety, explicit error boundaries, and environment-driven configuration.`
    }));

    return {
      title: jobTitle,
      slug,
      category,
      description: `Personalized target role benchmark derived directly from employer specifications for ${jobTitle}.`,
      isProvisionalBenchmark: false,
      seniority,
      mandatorySkills,
      importantSkills,
      preferredSkills,
      toolsAndTechnologies: Array.from(new Set(detectedTools)),
      practicalCapabilities,
      learningResources,
      portfolioProjects,
      milestonesTemplate,
      readinessQuizzes
    };
  }

  /**
   * Generates a clearly labeled provisional benchmark for a custom role title
   */
  static generateProvisionalBenchmark(roleTitle: string): ReturnType<typeof JobDescriptionParserService.parseJobDescription> {
    const parsed = this.parseJobDescription(
      `Target Career Benchmark for ${roleTitle}. Requires modern engineering practices, clean code, modular architecture, version control, and problem solving.`,
      roleTitle
    );
    parsed.isProvisionalBenchmark = true;
    parsed.description = `Provisional educational benchmark for "${roleTitle}". This represents an estimated industry skill baseline, not an individual verified employer job posting.`;
    return parsed;
  }
}
