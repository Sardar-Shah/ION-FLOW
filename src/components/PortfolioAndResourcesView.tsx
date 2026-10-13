import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Link,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Check,
  Award,
  Send,
  Code2
} from 'lucide-react';
import {
  IPortfolioProject,
  ILearningResource,
  ICareerSummary,
  IUser,
  ITargetRoleData,
  IReadinessQuizQuestion,
  api
} from '../api.ts';

interface PortfolioAndResourcesViewProps {
  careers: ICareerSummary[];
  targetCareerSlug: string;
  onRefreshStats: () => void;
  user?: IUser | null;
  onOpenAuth?: () => void;
  targetRoleData?: ITargetRoleData | null;
}

export const PortfolioAndResourcesView: React.FC<PortfolioAndResourcesViewProps> = ({
  careers,
  targetCareerSlug,
  onRefreshStats,
  user,
  onOpenAuth,
  targetRoleData
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'quizzes' | 'resources'>('projects');
  const [selectedSlug, setSelectedSlug] = useState(targetCareerSlug || 'full-stack-engineer');
  const [projects, setProjects] = useState<IPortfolioProject[]>(targetRoleData?.targetRole?.portfolioProjects || []);
  const [resources, setResources] = useState<ILearningResource[]>(targetRoleData?.targetRole?.learningResources || []);
  const [quizzes, setQuizzes] = useState<IReadinessQuizQuestion[]>(targetRoleData?.targetRole?.readinessQuizzes || []);

  const [loading, setLoading] = useState(false);
  const [savingProjectId, setSavingProjectId] = useState<string | null>(null);
  const [projectForms, setProjectForms] = useState<Record<string, { repoUrl: string; demoUrl: string; notes: string; submitted: boolean }>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Quizzes state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});

  useEffect(() => {
    if (targetRoleData?.targetRole) {
      if (targetRoleData.targetRole.portfolioProjects?.length) {
        setProjects(targetRoleData.targetRole.portfolioProjects);
      }
      if (targetRoleData.targetRole.learningResources?.length) {
        setResources(targetRoleData.targetRole.learningResources);
      }
      if (targetRoleData.targetRole.readinessQuizzes?.length) {
        setQuizzes(targetRoleData.targetRole.readinessQuizzes);
      }
    } else if (selectedSlug) {
      loadData(selectedSlug);
    }
  }, [selectedSlug, targetRoleData]);

  const loadData = async (slug: string) => {
    setLoading(true);
    try {
      const [projRes, resRes] = await Promise.all([
        api.getCareerProjects(slug),
        api.getCareerResources(slug)
      ]);
      setProjects(projRes.projects || []);
      setResources(resRes.resources || []);
    } catch (err: any) {
      console.warn('Portfolio load fallback note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (projectId: string, field: 'repoUrl' | 'demoUrl' | 'notes', value: string) => {
    setProjectForms((prev) => ({
      ...prev,
      [projectId]: {
        ...(prev[projectId] || { repoUrl: '', demoUrl: '', notes: '', submitted: false }),
        [field]: value
      }
    }));
  };

  const handleSubmitEvidence = async (projectId: string) => {
    const form = projectForms[projectId];
    if (!form || !form.repoUrl.trim()) {
      setStatusMessage('Please provide a repository URL (e.g. GitHub link) to verify evidence.');
      return;
    }

    setSavingProjectId(projectId);
    setStatusMessage(null);
    try {
      await api.submitProjectEvidence({
        projectId,
        repoUrl: form.repoUrl.trim(),
        liveUrl: form.demoUrl?.trim(),
        notes: form.notes?.trim()
      });

      setProjectForms((prev) => ({
        ...prev,
        [projectId]: {
          ...form,
          submitted: true
        }
      }));

      setStatusMessage('Project evidence submitted successfully! Readiness score updated with practical bonus.');
      onRefreshStats();
    } catch (err: any) {
      setStatusMessage(err?.message || 'Error submitting evidence.');
    } finally {
      setSavingProjectId(null);
    }
  };

  const handleAnswerQuiz = async (quizId: string, answerIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: answerIndex }));
    try {
      const res = await api.verifyReadinessQuiz(quizId, answerIndex);
      setQuizResults((prev) => ({
        ...prev,
        [quizId]: {
          isCorrect: res.isCorrect,
          explanation: res.explanation
        }
      }));
      onRefreshStats();
    } catch {
      // local check fallback
      const q = quizzes.find((quiz) => quiz.quizId === quizId);
      const isCorrect = q ? q.correctAnswer === answerIndex : answerIndex === 0;
      setQuizResults((prev) => ({
        ...prev,
        [quizId]: {
          isCorrect,
          explanation: q?.explanation || 'Recorded against verification rubrics.'
        }
      }));
    }
  };

  const careerTitle = targetRoleData?.targetRole?.title || 'Target Role';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
            <span>Step 6: Evidence Verification & Practical Application</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Projects & Readiness Verification</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Targeting: <strong className="text-slate-900">{careerTitle}</strong>. We verify practical readiness through real code submissions, repository deliverables, and scenario rubrics.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs self-start shrink-0">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'projects' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Targeted Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'quizzes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Readiness Quizzes ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'resources' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Resources ({resources.length})</span>
          </button>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tab 1: Targeted Portfolio Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-600">
            These projects directly target your identified skill gaps. Submit repository links and verified deliverables to increase your educational readiness score.
          </div>

          <div className="space-y-6">
            {projects.map((proj) => {
              const form = projectForms[proj.projectId] || { repoUrl: '', demoUrl: '', notes: '', submitted: false };
              const isSaving = savingProjectId === proj.projectId;

              return (
                <div
                  key={proj.projectId}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{proj.title}</h3>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-indigo-700">{proj.difficulty}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 font-mono">~{proj.estimatedHours} hrs</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{proj.description}</p>
                    </div>

                    {form.submitted && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Evidence Verified
                      </span>
                    )}
                  </div>

                  {/* Skills, Deliverables, Evaluation criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <strong className="block text-slate-800 mb-1">Demonstrated Skills:</strong>
                      <span className="text-slate-600 font-medium">
                        {proj.skillsDeveloped?.join(', ') || 'Full-Stack'}
                      </span>
                    </div>

                    <div>
                      <strong className="block text-slate-800 mb-1">Deliverables:</strong>
                      <ul className="text-slate-600 list-disc list-inside space-y-0.5">
                        {proj.deliverables?.map((d, dIdx) => (
                          <li key={dIdx} className="line-clamp-1">{d}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="block text-slate-800 mb-1">Evaluation Rubrics:</strong>
                      <ul className="text-slate-600 list-disc list-inside space-y-0.5">
                        {proj.completionCriteria?.map((c, cIdx) => (
                          <li key={cIdx} className="line-clamp-1">{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Evidence Submission Form */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Submit Practical Project Evidence
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          GitHub / GitLab Repository URL *
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/username/project-repo"
                          value={form.repoUrl}
                          onChange={(e) => handleFormChange(proj.projectId, 'repoUrl', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Live Demo URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://my-app.vercel.app"
                          value={form.demoUrl}
                          onChange={(e) => handleFormChange(proj.projectId, 'demoUrl', e.target.value)}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Architectural Notes & Tradeoffs
                      </label>
                      <input
                        type="text"
                        placeholder="Brief summary of challenges solved, test coverage, and technologies utilized..."
                        value={form.notes}
                        onChange={(e) => handleFormChange(proj.projectId, 'notes', e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleSubmitEvidence(proj.projectId)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
                      >
                        {isSaving ? (
                          <span>Submitting Evidence...</span>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Submit Evidence & Claim Readiness Points</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Readiness Verification Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="text-xs text-slate-600">
            Complete scenario-based knowledge checks to verify self-reported skills and elevate your readiness verification score.
          </div>

          <div className="space-y-6">
            {quizzes.map((quiz, qIdx) => {
              const selectedAnswer = quizAnswers[quiz.quizId];
              const result = quizResults[quiz.quizId];

              return (
                <div
                  key={quiz.quizId || qIdx}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Scenario Check #{qIdx + 1}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-indigo-700">{quiz.skillName}</span>
                    </div>

                    {result && (
                      <span className={`text-xs font-bold ${result.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {result.isCorrect ? 'Passed (+3 Evidence Points)' : 'Needs Review'}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {quiz.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2">
                    {quiz.options?.map((opt, optIdx) => {
                      const isSelected = selectedAnswer === optIdx;
                      let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

                      if (result) {
                        if (optIdx === quiz.correctAnswer) {
                          optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        } else if (isSelected && !result.isCorrect) {
                          optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                        }
                      } else if (isSelected) {
                        optionStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={!!result}
                          onClick={() => handleAnswerQuiz(quiz.quizId, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Result explanation */}
                  {result && (
                    <div className={`p-3.5 rounded-xl text-xs space-y-1 ${
                      result.isCorrect ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-slate-50 border border-slate-200 text-slate-800'
                    }`}>
                      <strong className="block font-semibold">
                        {result.isCorrect ? 'Correct Analysis' : 'Architectural Feedback:'}
                      </strong>
                      <p>{result.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Curated Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Targeted official documentation, guides, and courses for {careerTitle}:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res, rIdx) => (
              <div
                key={rIdx}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{res.provider}</span>
                    <span className="text-xs font-mono text-slate-500">{res.resourceType} · ~{res.estimatedHours}h</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{res.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{res.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-indigo-700 font-medium">
                    {res.relatedSkills?.join(', ')}
                  </span>
                  <a
                    href={res.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                  >
                    <span>Open Reference</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
