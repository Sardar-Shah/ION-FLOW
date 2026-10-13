export interface IUserSkill {
  skillName: string;
  normalizedName: string;
  level: number;
  source?: string;
  evidence?: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  degree?: string;
  educationLevel?: string;
  currentSemester?: string;
  careerInterests: string[];
  preferredLearningPace?: 'accelerated' | 'moderate' | 'relaxed';
  assessedSkills: IUserSkill[];
  targetCareerSlug?: string;
  savedCareers: string[];
  createdAt: string;
}

export interface IRequiredSkill {
  canonicalName: string;
  normalizedName: string;
  category: string;
  targetLevel: number;
  weight: number;
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
  userProgress?: {
    status: 'untracked' | 'started' | 'completed';
    startedAt?: string;
    completedAt?: string;
  };
}

export interface IPortfolioProject {
  projectId: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  skillsDeveloped: string[];
  deliverables: string[];
  completionCriteria: string[];
  userProgress?: {
    status: 'untracked' | 'saved' | 'in_progress' | 'completed';
    notes?: string;
    repoUrl?: string;
    demoUrl?: string;
    startedAt?: string;
    completedAt?: string;
  };
}

export interface ICareerSummary {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  responsibilitiesCount: number;
  requiredSkillsCount: number;
  learningResourcesCount: number;
  portfolioProjectsCount: number;
  requiredSkillsSummary: string[];
}

export interface ICareerDetail {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  responsibilities: string[];
  requiredSkills: IRequiredSkill[];
  learningResources: ILearningResource[];
  portfolioProjects: IPortfolioProject[];
  preparationAdvice: string[];
  milestonesTemplate: {
    stage: number;
    stageName: string;
    title: string;
    learningObjective: string;
    skillsCovered: string[];
    practicalTask: string;
    completionCriteria: string;
    estimatedEffort: string;
  }[];
}

export interface ISkillComparison {
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

export interface IAssessmentResult {
  readinessScore: number;
  skillsMetCount: number;
  skillsPartialCount: number;
  skillsMissingCount: number;
  totalRequiredWeight: number;
  achievedWeightedScore: number;
  detailedSkills: ISkillComparison[];
  rankedGaps: ISkillComparison[];
  recommendedNextAction: string;
  priorityResources: ILearningResource[];
  unassessedNote: string;
  career?: {
    title: string;
    slug: string;
    category: string;
  };
}

export interface IRoadmapMilestone {
  milestoneId: string;
  title: string;
  learningObjective: string;
  skillsCovered: string[];
  practicalTask: string;
  completionCriteria: string;
  estimatedEffort: string;
  status: 'not_started' | 'in_progress' | 'completed';
  isGapTargeted: boolean;
  completedAt?: string;
}

export interface IRoadmapStage {
  stageNumber: number;
  stageName: string;
  milestones: IRoadmapMilestone[];
}

export interface IRoadmapData {
  _id: string;
  careerSlug: string;
  careerTitle: string;
  stages: IRoadmapStage[];
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
}

export interface IDashboardStats {
  student: {
    id: string;
    name: string;
    email: string;
    degree?: string;
    educationLevel?: string;
    currentSemester?: string;
    preferredLearningPace?: string;
    profileCompletionPercentage: number;
    assessedSkillsCount: number;
  };
  targetCareer: {
    title: string;
    slug: string;
    category: string;
    description: string;
  };
  readiness: {
    score: number;
    skillsMetCount: number;
    skillsPartialCount: number;
    skillsMissingCount: number;
    totalRequiredWeight: number;
    achievedWeightedScore: number;
    recommendedNextAction: string;
    rankedGaps: ISkillComparison[];
  };
  roadmap: {
    totalMilestones: number;
    completedMilestones: number;
    progressPercentage: number;
    stagesCount: number;
  };
  portfolio: {
    completed: number;
    inProgress: number;
    saved: number;
    totalTracked: number;
  };
  resources: {
    completed: number;
  };
  historyData: {
    date: string;
    score: number;
    career: string;
  }[];
  categoryChartData: {
    category: string;
    totalAssessed: number;
    proficient: number;
  }[];
  recentActivity: {
    _id: string;
    actionType: string;
    title: string;
    description: string;
    createdAt: string;
  }[];
}

export interface IDatabaseStatus {
  connected: boolean;
  status: 'connected' | 'connecting' | 'disconnected' | 'missing_uri' | 'error';
  databaseName?: string;
  host?: string;
  message: string;
  actionRequired?: string;
  careerCount?: number;
  timestamp?: string;
}

export interface IExtractedSkill {
  name: string;
  category: string;
  level: number;
  evidence: string;
  confidence: 'demonstrated' | 'partially_demonstrated' | 'inferred';
  sourceSection: string;
  isCustomAdded?: boolean;
}

export interface ICareerRecommendation {
  title: string;
  slug: string;
  category: string;
  matchScore: number;
  whyItFits: string;
  relevantSkills: string[];
  unverifiedCapabilities: string[];
  developmentGaps: string[];
  recommendedNextAction: string;
  benchmarkSlug?: string;
}

export interface IResumeProfile {
  _id: string;
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
  education: Array<{
    school: string;
    degree: string;
    year?: string;
    gpa?: string;
    coursework?: string[];
  }>;
  skills: IExtractedSkill[];
  experience: Array<{
    role: string;
    company: string;
    duration?: string;
    highlights: string[];
  }>;
  projects: Array<{
    title: string;
    techStack: string[];
    description: string;
    highlights: string[];
    link?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer?: string;
    year?: string;
  }>;
  toolsAndTech: string[];
  transferableSkills: string[];
  strengths: string[];
  recommendedCareers: ICareerRecommendation[];
  isReviewed: boolean;
  aiAnalysisStatus: 'enhanced_by_gemini' | 'deterministic_parser' | 'error_fallback';
  aiAnalysisMessage?: string;
  createdAt?: string;
}

export interface IRoleRequirementSkill {
  name: string;
  category: string;
  minLevel: number;
  importance: 'Required' | 'Important' | 'Optional';
  weight: number;
  reason?: string;
}

export interface IReadinessQuizQuestion {
  quizId: string;
  skillName: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ITargetRole {
  _id?: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  source: 'recommended' | 'custom' | 'job_description' | 'benchmark';
  isProvisionalBenchmark: boolean;
  benchmarkSlug?: string;
  jobDescriptionText?: string;
  seniority: string;
  mandatorySkills: IRoleRequirementSkill[];
  importantSkills: IRoleRequirementSkill[];
  preferredSkills: IRoleRequirementSkill[];
  toolsAndTechnologies: string[];
  practicalCapabilities: string[];
  learningResources: ILearningResource[];
  portfolioProjects: IPortfolioProject[];
  milestonesTemplate: any[];
  readinessQuizzes: IReadinessQuizQuestion[];
}

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
  readinessScore: number;
  assessmentCoveragePercent: number;
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

export interface ITargetRoleData {
  targetRole: ITargetRole;
  roadmap: IRoadmapData;
  gapAnalysis: IReadinessEvaluation;
}

// Token storage helpers
const TOKEN_KEY = 'careerpath_ai_token';
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// Generic fetch wrapper with Bearer token & guest persistence
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  let guestId = '';
  if (typeof window !== 'undefined') {
    guestId = localStorage.getItem('careerpath_guest_id') || `guest-${Date.now()}`;
    localStorage.setItem('careerpath_guest_id', guestId);
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'x-guest-id': guestId,
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

// API methods
export const api = {
  // Auth
  register: (payload: any) =>
    apiRequest<{ user: IUser; token: string; message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<{ user: IUser; token: string; message: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getMe: () => apiRequest<{ user: IUser }>('/api/auth/me'),

  updateProfile: (payload: Partial<IUser>) =>
    apiRequest<{ user: IUser; message: string }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  logout: () => {
    removeToken();
    return apiRequest<{ message: string }>('/api/auth/logout', { method: 'POST' });
  },

  // Careers
  getCareers: (params?: { search?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.append('search', params.search);
    if (params?.category) q.append('category', params.category);
    return apiRequest<{ careers: ICareerSummary[]; total: number }>(`/api/careers?${q.toString()}`);
  },

  getCareerBySlug: (slug: string) =>
    apiRequest<{ career: ICareerDetail }>(`/api/careers/${slug}`),

  compareCareers: (slugs: string[]) =>
    apiRequest<{ careers: ICareerDetail[] }>(`/api/careers/compare?slugs=${slugs.join(',')}`),

  toggleFavoriteCareer: (slug: string) =>
    apiRequest<{ savedCareers: string[]; isSaved: boolean; message: string }>(`/api/careers/favorite/${slug}`, {
      method: 'POST'
    }),

  setTargetCareer: (slug: string) =>
    apiRequest<{ message: string; targetCareerSlug: string; targetCareerTitle: string }>(`/api/careers/set-target/${slug}`, {
      method: 'POST'
    }),

  // Skills
  getSkillsDirectory: () =>
    apiRequest<{ skills: any[]; total: number }>('/api/skills/directory'),

  getUserSkills: () =>
    apiRequest<{ assessedSkills: IUserSkill[] }>('/api/skills/user-skills'),

  saveUserSkill: (payload: { skillName: string; level: number; source?: string; evidence?: string }) =>
    apiRequest<{ message: string; skill: IUserSkill; assessedSkills: IUserSkill[] }>('/api/skills/user-skills', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  saveUserSkillsBatch: (skills: { skillName: string; level: number; source?: string; evidence?: string }[]) =>
    apiRequest<{ message: string; assessedSkills: IUserSkill[] }>('/api/skills/user-skills/batch', {
      method: 'POST',
      body: JSON.stringify({ skills })
    }),

  deleteUserSkill: (skillName: string) =>
    apiRequest<{ message: string; assessedSkills: IUserSkill[] }>(`/api/skills/user-skills/${encodeURIComponent(skillName)}`, {
      method: 'DELETE'
    }),

  // Assessment
  evaluateCareer: (careerSlug: string) =>
    apiRequest<IAssessmentResult>(`/api/assessment/evaluate/${careerSlug}`, {
      method: 'POST'
    }),

  getLatestAssessment: (careerSlug: string) =>
    apiRequest<IAssessmentResult>(`/api/assessment/latest/${careerSlug}`),

  getAssessmentHistory: () =>
    apiRequest<{ history: any[] }>('/api/assessment/history'),

  // Roadmap
  getRoadmap: (careerSlug: string) =>
    apiRequest<{ roadmap: IRoadmapData }>(`/api/roadmap/${careerSlug}`),

  regenerateRoadmap: (careerSlug: string) =>
    apiRequest<{ roadmap: IRoadmapData; message: string }>(`/api/roadmap/generate/${careerSlug}`, {
      method: 'POST'
    }),

  updateMilestoneStatus: (careerSlug: string, milestoneId: string, status: 'not_started' | 'in_progress' | 'completed') =>
    apiRequest<{ message: string; roadmap: IRoadmapData }>(`/api/roadmap/milestone/${careerSlug}/${milestoneId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // Projects
  getCareerProjects: (careerSlug: string) =>
    apiRequest<{ projects: IPortfolioProject[] }>(`/api/projects/${careerSlug}`),

  trackProject: (payload: {
    projectId: string;
    careerSlug: string;
    projectTitle?: string;
    status: 'saved' | 'in_progress' | 'completed';
    notes?: string;
    repoUrl?: string;
    demoUrl?: string;
  }) =>
    apiRequest<{ message: string; progress: any }>('/api/projects/track', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Resources
  getCareerResources: (careerSlug: string) =>
    apiRequest<{ resources: ILearningResource[] }>(`/api/resources/${careerSlug}`),

  trackResource: (payload: {
    resourceUrl: string;
    resourceTitle: string;
    careerSlug: string;
    status: 'started' | 'completed';
  }) =>
    apiRequest<{ message: string; progress: any }>('/api/resources/track', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Dashboard
  getDashboardStats: () =>
    apiRequest<IDashboardStats>('/api/dashboard/stats'),

  // Database status & seed
  getDatabaseStatus: () =>
    apiRequest<IDatabaseStatus>('/api/db-status'),

  retryDbConnection: () =>
    apiRequest<IDatabaseStatus>('/api/db-status/retry', {
      method: 'POST'
    }),

  triggerSeed: () =>
    apiRequest<{ success: boolean; count: number; message: string }>('/api/db-status/seed', {
      method: 'POST'
    }),

  // Resume Processing & Discovery
  parseResumeFile: (formData: FormData) =>
    apiRequest<{ success: boolean; profile: IResumeProfile; message: string }>('/api/resume/parse', {
      method: 'POST',
      body: formData
    }),

  parseResumeText: (text: string, fileName?: string, fileType?: string) =>
    apiRequest<{ success: boolean; profile: IResumeProfile; message: string }>('/api/resume/parse', {
      method: 'POST',
      body: JSON.stringify({ text, fileName, fileType })
    }),

  getLatestResume: () =>
    apiRequest<{ success: boolean; profile: IResumeProfile; isDefaultPreview?: boolean }>('/api/resume/latest'),

  reviewResume: (payload: { skills: IExtractedSkill[]; education?: any[]; experience?: any[]; projects?: any[] }) =>
    apiRequest<{ success: boolean; profile: IResumeProfile; message: string }>('/api/resume/review', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  getResumeSamples: () =>
    apiRequest<{ success: boolean; samples: Array<{ id: string; title: string; text: string }> }>('/api/resume/samples'),

  // Target Role & 5-Stage Roadmap & Gap Analysis
  selectTargetRole: (payload: {
    roleType: 'recommended' | 'custom' | 'job_description' | 'benchmark';
    title?: string;
    slug?: string;
    benchmarkSlug?: string;
    jobText?: string;
  }) =>
    apiRequest<{ success: boolean; data: ITargetRoleData; message: string }>('/api/target-role/select', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCurrentTargetRole: () =>
    apiRequest<{ success: boolean; data: ITargetRoleData }>('/api/target-role/current'),

  verifyReadinessQuiz: (quizId: string, selectedAnswer: number) =>
    apiRequest<{ success: boolean; isCorrect: boolean; explanation: string; totalQuizzesPassed: number }>(
      '/api/target-role/verify-quiz',
      {
        method: 'POST',
        body: JSON.stringify({ quizId, selectedAnswer })
      }
    ),

  submitProjectEvidence: (payload: { projectId: string; repoUrl: string; liveUrl?: string; notes?: string }) =>
    apiRequest<{ success: boolean; message: string; submittedProjects: any[] }>(
      '/api/target-role/submit-project-evidence',
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )
};

