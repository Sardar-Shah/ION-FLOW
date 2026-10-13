import React, { useState, useEffect } from 'react';
import {
  BarChart2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Target,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Compass,
  Info
} from 'lucide-react';
import {
  IAssessmentResult,
  ICareerSummary,
  IUser,
  ITargetRoleData,
  IResumeProfile,
  ISkillAnalysisResult,
  api
} from '../api.ts';

interface GapAnalysisViewProps {
  careers: ICareerSummary[];
  targetCareerSlug: string;
  onNavigateTab: (tab: string) => void;
  user?: IUser | null;
  onOpenAuth?: () => void;
  targetRoleData?: ITargetRoleData | null;
  resumeProfile?: IResumeProfile | null;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  careers,
  targetCareerSlug,
  onNavigateTab,
  user,
  onOpenAuth,
  targetRoleData,
  resumeProfile
}) => {
  const [selectedSlug, setSelectedSlug] = useState(targetCareerSlug || 'full-stack-engineer');
  const [assessment, setAssessment] = useState<IAssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterState, setFilterState] = useState<'all' | 'demonstrated' | 'partial' | 'unconfirmed' | 'missing'>('all');

  useEffect(() => {
    if (!targetRoleData && selectedSlug) {
      loadAssessment(selectedSlug);
    }
  }, [selectedSlug, targetRoleData]);

  const loadAssessment = async (slug: string) => {
    setLoading(true);
    try {
      const res = await api.getLatestAssessment(slug);
      setAssessment(res);
    } catch {
      try {
        const freshRes = await api.evaluateCareer(slug);
        setAssessment(freshRes);
      } catch (err: any) {
        console.warn('Gap assessment fallback', err?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract either from rich targetRoleData or legacy assessment
  const targetTitle = targetRoleData?.targetRole?.title || assessment?.career?.title || (assessment as any)?.careerTitle || 'Target Career';
  const isProvisional = targetRoleData?.targetRole?.isProvisionalBenchmark ?? false;
  const isJobPosting = targetRoleData?.targetRole?.source === 'job_description';

  const readinessScore = targetRoleData?.gapAnalysis?.readinessScore ?? assessment?.readinessScore ?? 65;
  const coveragePercent = targetRoleData?.gapAnalysis?.assessmentCoveragePercent ?? 85;
  const demonstratedCount = targetRoleData?.gapAnalysis?.demonstratedCount ?? assessment?.skillsMetCount ?? (assessment as any)?.skillsMet ?? 0;
  const partialCount = targetRoleData?.gapAnalysis?.partialCount ?? assessment?.skillsPartialCount ?? (assessment as any)?.skillsPartial ?? 0;
  const unconfirmedCount = targetRoleData?.gapAnalysis?.unconfirmedCount ?? 0;
  const missingCount = targetRoleData?.gapAnalysis?.missingCount ?? assessment?.skillsMissingCount ?? (assessment as any)?.skillsMissing ?? 0;
  const nextAction = targetRoleData?.gapAnalysis?.recommendedNextAction ?? assessment?.recommendedNextAction ?? 'Proceed to Stage 2 Core Skills.';

  // Normalize skills list
  const detailedSkills: ISkillAnalysisResult[] = targetRoleData?.gapAnalysis?.detailedSkills || (
    assessment?.detailedSkills?.map((ds) => ({
      skillName: ds.skillName,
      category: ds.category,
      currentLevel: ds.currentLevel,
      targetLevel: ds.targetLevel,
      importance: ds.importance,
      weight: ds.weight,
      status: ds.status === 'met' ? 'demonstrated' : ds.status === 'partial' ? 'partial' : 'missing',
      evidence: ds.currentLevel > 0 ? `Demonstrated level ${ds.currentLevel}/5` : 'No direct evidence identified.',
      confidence: ds.status === 'met' ? 'demonstrated' : ds.status === 'partial' ? 'partially_demonstrated' : 'none',
      gapSeverity: ds.status === 'met' ? 'None' : ds.importance === 'Required' ? 'High' : 'Medium',
      recommendedNextAction: `Practice ${ds.skillName} to reach level ${ds.targetLevel}/5.`
    })) || []
  );

  const filteredSkills = detailedSkills.filter((s) => {
    if (filterState === 'all') return true;
    return s.status === filterState;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
            <span>Step 4: Real Skill-Gap Analysis & Evidence Mapping</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{targetTitle}</h1>
            {isJobPosting && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Verified Job Posting
              </span>
            )}
            {isProvisional && (
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                Provisional Benchmark
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Compares verified resume capabilities with target requirements. Identifies what employers require and precisely where to focus your effort.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('career-discovery')}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Change Target Role
          </button>
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <span>View 5-Stage Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Readiness & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Readiness Gauge Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Educational Readiness</span>
              <span className="text-xs text-slate-500 font-mono">Coverage: {coveragePercent}%</span>
            </div>

            <div className="flex items-center gap-6 mt-6">
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-8 border-indigo-100 bg-white">
                <div
                  className="absolute inset-0 rounded-full border-8 border-indigo-600 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${readinessScore > 25 ? '100% 0%' : '50% 0%'}, ${readinessScore > 50 ? '100% 100%' : '50% 0%'}, ${readinessScore > 75 ? '0% 100%' : '50% 0%'}, ${readinessScore >= 95 ? '0% 0%' : '50% 0%'})`
                  }}
                />
                <div className="relative text-center">
                  <span className="text-3xl font-extrabold text-slate-900">{readinessScore}%</span>
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">Score</span>
                </div>
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="text-xs font-bold text-slate-900">
                  {readinessScore >= 80 ? 'Well Prepared' : readinessScore >= 60 ? 'Moderate Foundation' : 'Core Gaps Identified'}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Calculated from weighted skill requirements and verified evidence in your resume profile.
                </p>
                <div className="text-[11px] text-indigo-700 font-medium pt-1">
                  + Verified project and quiz evidence attached
                </div>
              </div>
            </div>
          </div>

          {/* Educational indicator disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Educational Progress Indicator:</strong> This score measures preparation against learning milestones, not a statistical hiring guarantee.
            </span>
          </div>
        </div>

        {/* 4-Stat Evidence Breakdown Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Demonstrated</div>
              <div className="text-2xl font-extrabold text-emerald-700 mt-1">{demonstratedCount}</div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Meets target level with resume evidence
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Partial</div>
              <div className="text-2xl font-extrabold text-indigo-700 mt-1">{partialCount}</div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Foundational exposure; needs depth
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Unconfirmed</div>
              <div className="text-2xl font-extrabold text-amber-700 mt-1">{unconfirmedCount}</div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Listed in skills; pending project verification
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase">Missing / Gaps</div>
              <div className="text-2xl font-extrabold text-rose-700 mt-1">{missingCount}</div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2">
              Targeted by roadmap stages 1 & 2
            </div>
          </div>

          {/* Actionable recommendation card spanning 4 cols */}
          <div className="col-span-2 md:col-span-4 bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-indigo-900 uppercase">Recommended Immediate Action</div>
              <div className="text-xs text-indigo-800 font-medium mt-0.5">{nextAction}</div>
            </div>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs shrink-0 transition-colors"
            >
              Start Milestone
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Skill Comparison & Evidence Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Skill Competency & Evidence Audit</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review current evidence against employer target levels.
            </p>
          </div>

          {/* Filter control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterState === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({detailedSkills.length})
            </button>
            <button
              onClick={() => setFilterState('demonstrated')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterState === 'demonstrated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demonstrated ({demonstratedCount})
            </button>
            <button
              onClick={() => setFilterState('partial')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterState === 'partial' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Partial ({partialCount})
            </button>
            <button
              onClick={() => setFilterState('missing')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                filterState === 'missing' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gaps ({missingCount})
            </button>
          </div>
        </div>

        {/* Skill rows */}
        <div className="divide-y divide-slate-100">
          {filteredSkills.map((skill, idx) => (
            <div key={idx} className="py-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{skill.skillName}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{skill.category}</span>
                  <span className="text-xs text-slate-300">·</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {skill.importance} (Weight {skill.weight}x)
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-500">Current: {skill.currentLevel}/5</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-semibold text-indigo-700">Target: {skill.targetLevel}/5</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    skill.status === 'demonstrated'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : skill.status === 'partial'
                      ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      : skill.status === 'unconfirmed'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {skill.status === 'demonstrated'
                      ? 'Demonstrated'
                      : skill.status === 'partial'
                      ? 'Partial'
                      : skill.status === 'unconfirmed'
                      ? 'Unconfirmed'
                      : 'Gap Identified'}
                  </span>
                </div>
              </div>

              {/* Evidence line */}
              <div className="text-xs text-slate-600 pl-3 border-l-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span>
                  <strong>Evidence:</strong> {skill.evidence}
                </span>
                <span className="text-[11px] text-slate-500 italic shrink-0">
                  {skill.recommendedNextAction}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No skills found under this filter.
          </div>
        )}
      </div>
    </div>
  );
};
