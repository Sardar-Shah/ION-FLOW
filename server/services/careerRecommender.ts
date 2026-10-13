import { GoogleGenAI } from '@google/genai';
import { IExtractedSkill, ICareerRecommendation, IProjectItem, IExperienceItem } from '../models/ResumeProfile.ts';

// Comprehensive catalog of reference industry career archetypes
export interface CareerArchetype {
  title: string;
  slug: string;
  category: string;
  coreRequired: string[];
  important: string[];
  benchmarkSlug?: string;
  description: string;
}

export const CAREER_ARCHETYPES: CareerArchetype[] = [
  {
    title: 'Full-Stack Software Engineer',
    slug: 'full-stack-engineer',
    benchmarkSlug: 'full-stack-engineer',
    category: 'Software Development',
    description: 'Designs and builds end-to-end web applications across client interfaces and backend microservices.',
    coreRequired: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'RESTful APIs', 'SQL', 'Git & Version Control'],
    important: ['Tailwind CSS', 'Docker', 'MongoDB', 'PostgreSQL', 'Automated Testing (Unit/E2E)']
  },
  {
    title: 'Backend Systems Engineer',
    slug: 'backend-engineer',
    category: 'Software Development',
    description: 'Specializes in high-throughput API services, concurrency, data persistence, and system architecture.',
    coreRequired: ['Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'RESTful APIs', 'Microservices Architecture'],
    important: ['Redis', 'Docker', 'Linux Administration', 'gRPC', 'System Design & Architecture']
  },
  {
    title: 'Cloud & DevOps Engineer',
    slug: 'devops-cloud-engineer',
    benchmarkSlug: 'cloud-devops-engineer',
    category: 'Cybersecurity and Cloud',
    description: 'Automates infrastructure deployment, CI/CD pipelines, container orchestration, and cloud reliability.',
    coreRequired: ['Docker', 'Kubernetes', 'AWS', 'Linux Administration', 'CI/CD Pipelines', 'Bash/Shell'],
    important: ['Terraform', 'Google Cloud Platform (GCP)', 'Git & Version Control', 'Python', 'Network Security']
  },
  {
    title: 'Machine Learning & AI Engineer',
    slug: 'ml-ai-engineer',
    benchmarkSlug: 'ai-ml-engineer',
    category: 'Data and Artificial Intelligence',
    description: 'Builds, fine-tunes, and deploys intelligent models, LLM agents, and automated inference pipelines.',
    coreRequired: ['Python', 'Machine Learning', 'Deep Learning', 'Data Analysis & Pandas', 'Generative AI & LLMs'],
    important: ['SQL', 'Docker', 'FastAPI', 'Data Visualization', 'Git & Version Control']
  },
  {
    title: 'Cybersecurity & SOC Analyst',
    slug: 'cybersecurity-analyst',
    benchmarkSlug: 'cybersecurity-analyst',
    category: 'Cybersecurity and Cloud',
    description: 'Monitors threat surfaces, analyzes vulnerabilities, enforces cryptographic boundaries, and safeguards systems.',
    coreRequired: ['Network Security', 'OWASP Security', 'Cryptography & Auth', 'Linux Administration', 'Bash/Shell'],
    important: ['Penetration Testing', 'SIEM & SOC Analysis', 'Python', 'Git & Version Control']
  },
  {
    title: 'Data Platform Engineer',
    slug: 'data-platform-engineer',
    benchmarkSlug: 'data-engineer',
    category: 'Data and Artificial Intelligence',
    description: 'Constructs reliable data pipelines, data warehouses, real-time ingestion, and transformation pipelines.',
    coreRequired: ['Python', 'SQL', 'PostgreSQL', 'Data Engineering & ETL', 'Data Analysis & Pandas'],
    important: ['Docker', 'AWS', 'Redis', 'Bash/Shell', 'Linux Administration']
  },
  {
    title: 'Mobile App Engineer (iOS/Android)',
    slug: 'mobile-app-engineer',
    category: 'Software Development',
    description: 'Crafts responsive, native, or cross-platform mobile experiences with smooth offline syncing.',
    coreRequired: ['JavaScript', 'TypeScript', 'React Native', 'RESTful APIs', 'Git & Version Control'],
    important: ['Flutter', 'Redux', 'Automated Testing (Unit/E2E)', 'Tailwind CSS']
  },
  {
    title: 'Frontend Platform Engineer',
    slug: 'frontend-platform-engineer',
    benchmarkSlug: 'frontend-engineer',
    category: 'Software Development',
    description: 'Focuses on UI architecture, component design systems, rendering performance, and web vitals.',
    coreRequired: ['React', 'TypeScript', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS', 'Next.js'],
    important: ['Redux', 'Git & Version Control', 'Automated Testing (Unit/E2E)', 'RESTful APIs']
  },
  {
    title: 'Site Reliability & Systems Engineer',
    slug: 'site-reliability-engineer',
    category: 'Cybersecurity and Cloud',
    description: 'Guarantees uptime, latency SLAs, incident observability, disaster recovery, and automated failover.',
    coreRequired: ['Linux Administration', 'Docker', 'Kubernetes', 'Bash/Shell', 'Python', 'CI/CD Pipelines'],
    important: ['AWS', 'Network Security', 'System Design & Architecture', 'Terraform']
  },
  {
    title: 'QA & Test Automation Engineer',
    slug: 'qa-automation-engineer',
    category: 'Software Development',
    description: 'Ensures software reliability through automated end-to-end tests, regression pipelines, and performance audits.',
    coreRequired: ['Automated Testing (Unit/E2E)', 'JavaScript', 'Python', 'CI/CD Pipelines', 'Git & Version Control'],
    important: ['RESTful APIs', 'Docker', 'Agile & Scrum', 'TypeScript']
  }
];

export class CareerRecommenderService {
  /**
   * Generates tailored career recommendations based on parsed resume
   */
  static async generateRecommendations(params: {
    skills: IExtractedSkill[];
    projects: IProjectItem[];
    experience: IExperienceItem[];
    education: any[];
    strengths: string[];
    userInterests?: string[];
  }): Promise<{
    recommendations: ICareerRecommendation[];
    aiStatus: 'enhanced_by_gemini' | 'deterministic_parser' | 'error_fallback';
    message: string;
  }> {
    const { skills, projects, experience, strengths, userInterests } = params;
    const skillNames = new Set(skills.map((s) => s.name.toLowerCase()));

    // Deterministic match computation
    const scoredArchetypes = CAREER_ARCHETYPES.map((arch) => {
      let matchedCore = 0;
      let matchedImportant = 0;

      const relevantSkills: string[] = [];
      const unverified: string[] = [];
      const gaps: string[] = [];

      arch.coreRequired.forEach((req) => {
        const found = skills.find((s) => s.name.toLowerCase() === req.toLowerCase());
        if (found) {
          matchedCore++;
          relevantSkills.push(req);
          if (found.confidence === 'inferred') {
            unverified.push(req);
          }
        } else {
          gaps.push(req);
        }
      });

      arch.important.forEach((req) => {
        const found = skills.find((s) => s.name.toLowerCase() === req.toLowerCase());
        if (found) {
          matchedImportant++;
          relevantSkills.push(req);
          if (found.confidence === 'inferred') {
            unverified.push(req);
          }
        } else {
          gaps.push(req);
        }
      });

      // Weighted score
      const coreWeight = 0.7;
      const importantWeight = 0.3;
      const coreScore = arch.coreRequired.length > 0 ? (matchedCore / arch.coreRequired.length) * 100 : 50;
      const importantScore = arch.important.length > 0 ? (matchedImportant / arch.important.length) * 100 : 50;

      let matchScore = Math.round(coreScore * coreWeight + importantScore * importantWeight);

      // Interest boost
      if (userInterests && userInterests.some((int) => arch.title.toLowerCase().includes(int.toLowerCase()) || arch.category.toLowerCase().includes(int.toLowerCase()))) {
        matchScore = Math.min(98, matchScore + 10);
      }

      // Clamp score
      matchScore = Math.max(35, Math.min(96, matchScore));

      const whyItFits = `Strong alignment with your demonstrated competencies in ${relevantSkills.slice(0, 3).join(', ') || 'software fundamentals'}. Your background in ${arch.category} provides an excellent launchpad.`;
      const nextAction = gaps.length > 0 ? `Complete focused projects in ${gaps.slice(0, 2).join(' and ')} to bridge identified gaps.` : `Build a capstone portfolio project demonstrating ${arch.title} architectural rigor.`;

      return {
        title: arch.title,
        slug: arch.slug,
        category: arch.category,
        matchScore,
        whyItFits,
        relevantSkills: relevantSkills.slice(0, 5),
        unverifiedCapabilities: unverified.slice(0, 4),
        developmentGaps: gaps.slice(0, 4),
        recommendedNextAction: nextAction,
        benchmarkSlug: arch.benchmarkSlug
      };
    });

    // Sort by match score descending
    scoredArchetypes.sort((a, b) => b.matchScore - a.matchScore);
    const topCandidates = scoredArchetypes.slice(0, 5);

    // Attempt Gemini enhancement if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI();
        const prompt = `You are CareerPath AI's senior career advisor. Given the student's analyzed resume profile:
Extracted Skills: ${skills.map((s) => `${s.name} (${s.confidence}, lvl ${s.level})`).join(', ')}
Strengths: ${strengths.join(', ')}
Projects: ${projects.map((p) => p.title).join(', ')}

Provide 4 to 5 personalized career recommendations.
Return ONLY valid JSON matching this structure:
{
  "recommendations": [
    {
      "title": "string",
      "slug": "string",
      "category": "string",
      "matchScore": number (35 to 98),
      "whyItFits": "concise 2-sentence explanation citing actual resume skills",
      "relevantSkills": ["skill1", "skill2"],
      "unverifiedCapabilities": ["skillA"],
      "developmentGaps": ["gap1", "gap2"],
      "recommendedNextAction": "actionable next step",
      "benchmarkSlug": "optional benchmark slug or undefined"
    }
  ]
}`;

        // Safe timeout with Promise.race
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini request timeout')), 7000)
        );

        const aiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const res: any = await Promise.race([aiPromise, timeoutPromise]);
        const parsed = JSON.parse(res.text || '{}');

        if (Array.isArray(parsed.recommendations) && parsed.recommendations.length >= 3) {
          // Normalize recommendations
          const normalized = parsed.recommendations.map((rec: any, idx: number) => ({
            title: rec.title || topCandidates[idx]?.title || 'Software Engineer',
            slug: rec.slug || (rec.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            category: rec.category || topCandidates[idx]?.category || 'Software Development',
            matchScore: Math.min(98, Math.max(35, Number(rec.matchScore) || 75)),
            whyItFits: rec.whyItFits || topCandidates[idx]?.whyItFits || '',
            relevantSkills: Array.isArray(rec.relevantSkills) ? rec.relevantSkills : topCandidates[idx]?.relevantSkills || [],
            unverifiedCapabilities: Array.isArray(rec.unverifiedCapabilities) ? rec.unverifiedCapabilities : [],
            developmentGaps: Array.isArray(rec.developmentGaps) ? rec.developmentGaps : topCandidates[idx]?.developmentGaps || [],
            recommendedNextAction: rec.recommendedNextAction || topCandidates[idx]?.recommendedNextAction || '',
            benchmarkSlug: rec.benchmarkSlug || topCandidates.find((tc) => tc.title.toLowerCase() === (rec.title || '').toLowerCase())?.benchmarkSlug
          }));

          return {
            recommendations: normalized,
            aiStatus: 'enhanced_by_gemini',
            message: 'Recommendations generated with Gemini career intelligence model.'
          };
        }
      } catch (err: any) {
        console.info('[CareerRecommender] Gemini AI fallback active:', err.message);
      }
    }

    return {
      recommendations: topCandidates,
      aiStatus: 'deterministic_parser',
      message: 'Recommendations evaluated by CareerPath AI multi-dimensional skill matching engine.'
    };
  }
}
