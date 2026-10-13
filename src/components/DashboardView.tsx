import React from 'react';
import {
  Compass,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Sparkles,
  BookOpen,
  FolderGit2,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { IDashboardStats, ITargetRoleData, IResumeProfile } from '../api.ts';

interface DashboardViewProps {
  stats: IDashboardStats | null;
  loading: boolean;
  onNavigateTab: (tab: string) => void;
  targetRoleData?: ITargetRoleData | null;
  resumeProfile?: IResumeProfile | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  loading,
  onNavigateTab,
  targetRoleData,
  resumeProfile
}) => {
  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500">Calculating career readiness and skill gaps...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">No dashboard statistics available yet.</p>
      </div>
    );
  }

  const { student, targetCareer, readiness, roadmap, portfolio, historyData, categoryChartData, recentActivity } = stats;

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Interview Ready', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 50) return { label: 'Accelerating Progress', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 25) return { label: 'Building Core Skills', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Foundational Exploration', color: 'text-slate-700 bg-slate-100 border-slate-200' };
  };

  const status = getScoreStatus(readiness.score);

  return (
    <div className="space-y-6">
      {/* Student Profile Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>{student.degree || 'University Student'}</span>
            <span aria-hidden="true">·</span>
            <span>{student.currentSemester || 'Semester 1'}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{student.preferredLearningPace || 'Moderate'} Pace</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {student.name}
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Targeting <span className="font-semibold text-slate-900">{targetCareer.title}</span> ({targetCareer.category}). Real-time gap analysis reveals your current strengths and upcoming learning milestones.
          </p>
        </div>

        {/* Profile Completion Indicator */}
        <div className="lg:min-w-[240px] bg-slate-50 rounded-lg p-3.5 border border-slate-200/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-slate-700">Profile Completion</span>
            <span className="font-mono font-bold text-indigo-600 tabular-nums">
              {student.profileCompletionPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${student.profileCompletionPercentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {student.assessedSkillsCount} skills assessed in profile
          </p>
        </div>
      </div>

      {/* Top Metric Strip (Zero-Pill, high scannability) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Readiness Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Career-Readiness</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {readiness.score}%
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Formula: weighted ratio of completed proficiencies
          </p>
        </div>

        {/* Metric 2: Target Career */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Target Role</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-bold text-slate-900 text-base truncate" title={targetCareer.title}>
            {targetCareer.title}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-500">{targetCareer.category}</span>
            <button
              onClick={() => onNavigateTab('careers')}
              className="text-[11px] text-indigo-600 font-medium hover:underline flex items-center gap-0.5"
            >
              Switch <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3: Skill Gaps */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Skill Gaps</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div>
              <span className="font-bold text-emerald-600 font-mono tabular-nums text-lg">
                {readiness.skillsMetCount}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">Met</span>
            </div>
            <div>
              <span className="font-bold text-amber-600 font-mono tabular-nums text-lg">
                {readiness.skillsPartialCount}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">Partial</span>
            </div>
            <div>
              <span className="font-bold text-rose-600 font-mono tabular-nums text-lg">
                {readiness.skillsMissingCount}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">Missing</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('gap-analysis')}
            className="text-[11px] text-indigo-600 font-medium hover:underline mt-2 inline-block"
          >
            Review all required skills
          </button>
        </div>

        {/* Metric 4: Roadmap Milestones */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Roadmap Progress</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {roadmap.progressPercentage}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({roadmap.completedMilestones}/{roadmap.totalMilestones} done)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-indigo-600 h-1.5 rounded-full"
              style={{ width: `${roadmap.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Next Action Banner */}
      <div className="bg-indigo-900 text-white rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-800 rounded-lg text-indigo-200 mt-0.5 shrink-0">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
              Personalized Recommendation Engine
            </div>
            <p className="text-sm font-medium text-white mt-1">
              {readiness.recommendedNextAction}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="px-4 py-2 text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
          >
            <span>Open Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Charts & Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Progression Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Readiness Score Progression
              </h3>
              <p className="text-xs text-slate-500">
                Score changes based on saved assessments
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-600 font-bold tabular-nums">
              Latest: {readiness.score}%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  formatter={(value: any) => [`${value}% Readiness`, 'Score']}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Competency Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Skill Domain Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Assessed competencies by technical domain
              </p>
            </div>
            <span className="text-xs text-slate-500">Level 3+ Proficient</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryChartData.length > 0 ? categoryChartData : [
                  { category: 'Security', totalAssessed: 3, proficient: 1 },
                  { category: 'Data', totalAssessed: 2, proficient: 1 },
                  { category: 'Dev', totalAssessed: 2, proficient: 2 }
                ]}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="totalAssessed" name="Total Assessed" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="proficient" name="Proficient (L3+)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Top Prioritized Gaps & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3): Priority Skill Gaps */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                High-Priority Skill Gaps for {targetCareer.title}
              </h3>
              <p className="text-xs text-slate-500">
                Ranked by career requirement weight and proficiency delta
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('skills')}
              className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              Update Assessments <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {readiness.rankedGaps && readiness.rankedGaps.length > 0 ? (
              readiness.rankedGaps.map((gap, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{gap.skillName}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          gap.importance === 'Required'
                            ? 'bg-rose-100 text-rose-800'
                            : gap.importance === 'Important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {gap.importance} (Weight {gap.weight})
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Current Level {gap.currentLevel}/5 · Target Level {gap.targetLevel}/5
                    </div>
                  </div>

                  {/* Level progress visualization */}
                  <div className="flex items-center gap-3">
                    <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          gap.currentLevel === 0 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${(gap.currentLevel / gap.targetLevel) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() => onNavigateTab('skills')}
                      className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors whitespace-nowrap"
                    >
                      Rate Skill
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="font-medium text-slate-800">No critical skill gaps identified!</p>
                <p className="mt-1">All required proficiencies for {targetCareer.title} have met or exceeded target benchmarks.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3): Recent Activity Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((act) => (
                <div key={act._id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-medium text-slate-800">{act.title}</p>
                    <p className="text-[11px] text-slate-500">{act.description}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent activity recorded yet. Take an assessment to start tracking!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
