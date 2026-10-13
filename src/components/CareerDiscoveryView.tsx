import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  FileText,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Briefcase,
  Layers,
  ChevronRight,
  Compass,
  FileCheck2,
  Clock,
  Zap,
  Target
} from 'lucide-react';
import { api, IResumeProfile, ICareerRecommendation, ITargetRoleData, ICareerSummary } from '../api.ts';

interface CareerDiscoveryViewProps {
  profile: IResumeProfile | null;
  onSelectRole: (roleData: ITargetRoleData) => void;
  onNavigateToUpload: () => void;
  benchmarkCareers: ICareerSummary[];
}

export const CareerDiscoveryView: React.FC<CareerDiscoveryViewProps> = ({
  profile,
  onSelectRole,
  onNavigateToUpload,
  benchmarkCareers
}) => {
  const [activeTab, setActiveTab] = useState<'recommended' | 'job_description' | 'custom' | 'benchmarks'>('recommended');
  const [customTitle, setCustomTitle] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const recommendations = profile?.recommendedCareers || [];

  const handleSelectRecommendation = async (rec: ICareerRecommendation) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.selectTargetRole({
        roleType: rec.benchmarkSlug ? 'benchmark' : 'recommended',
        title: rec.title,
        slug: rec.slug,
        benchmarkSlug: rec.benchmarkSlug
      });
      if (res.success && res.data) {
        onSelectRole(res.data);
      } else {
        setError(res.message || 'Failed to select role.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error configuring target role.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBenchmark = async (career: ICareerSummary) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.selectTargetRole({
        roleType: 'benchmark',
        title: career.title,
        slug: career.slug,
        benchmarkSlug: career.slug
      });
      if (res.success && res.data) {
        onSelectRole(res.data);
      } else {
        setError(res.message || 'Failed to configure benchmark.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error configuring benchmark.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCustomRole = async () => {
    if (!customTitle.trim()) {
      setError('Please provide a target career title.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.selectTargetRole({
        roleType: 'custom',
        title: customTitle.trim()
      });
      if (res.success && res.data) {
        onSelectRole(res.data);
      } else {
        setError(res.message || 'Failed to generate custom role benchmark.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error processing custom career title.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitJobDescription = async () => {
    if (!jobDescriptionText.trim() || jobDescriptionText.trim().length < 50) {
      setError('Please paste a job description with at least 50 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.selectTargetRole({
        roleType: 'job_description',
        title: jobTitleInput.trim() || 'Target Employer Role',
        jobText: jobDescriptionText.trim()
      });
      if (res.success && res.data) {
        onSelectRole(res.data);
      } else {
        setError(res.message || 'Failed to analyze job description.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error analyzing job posting.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.relevantSkills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
            <span>Step 3: Personalized Career Discovery & Target Role Selection</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Choose Your Target Career</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Select a career dynamically matched to your resume, enter any custom profession, or paste an actual employer job description.
          </p>
        </div>

        {profile && (
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
            <span className="font-semibold text-slate-900">{profile.personalInfo?.fullName || 'Analyzed Profile'}</span>
            <span className="text-slate-300">·</span>
            <span className="text-emerald-700 font-medium">{profile.skills?.length || 0} Skills Extracted</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-2xl">
        <button
          onClick={() => setActiveTab('recommended')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'recommended' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Personalized Matches ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('job_description')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'job_description' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Paste Job Description</span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Custom Career Title</span>
        </button>

        <button
          onClick={() => setActiveTab('benchmarks')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'benchmarks' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>12 Benchmarks</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Tab 1: Dynamic Recommendations */}
      {activeTab === 'recommended' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search matching careers or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-xs text-slate-500">
              Generated by Gemini 3.8 & Multi-Dimensional Skill Matrix
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{rec.category}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-0.5">{rec.title}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-indigo-700">{rec.matchScore}%</span>
                      <div className="text-[10px] text-slate-500">Skill Fit</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.whyItFits}
                  </p>

                  {/* Skills breakdown */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="font-semibold text-slate-700">Demonstrated in Resume: </span>
                      <span className="text-emerald-700 font-medium">
                        {rec.relevantSkills?.join(', ') || 'Core Foundations'}
                      </span>
                    </div>

                    {rec.developmentGaps && rec.developmentGaps.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-700">Key Gaps to Develop: </span>
                        <span className="text-amber-700 font-medium">
                          {rec.developmentGaps.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 italic max-w-xs line-clamp-1">
                    {rec.recommendedNextAction}
                  </div>

                  <button
                    onClick={() => handleSelectRecommendation(rec)}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors shrink-0 disabled:opacity-60"
                  >
                    <span>Target This Role</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Compass className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800">No matching careers found</p>
              <p className="text-xs text-slate-500">Try modifying your search or upload a more detailed resume.</p>
              <button
                onClick={onNavigateToUpload}
                className="mt-2 text-xs font-semibold text-indigo-600 underline"
              >
                Go to Resume Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Paste Job Description */}
      {activeTab === 'job_description' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Analyze an Actual Job Description</h2>
            <p className="text-xs text-slate-600 mt-1">
              Paste the text of a real job posting. CareerPath AI will parse mandatory and preferred qualifications, extract tools, and evaluate your resume against real employer requirements.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Posting Title / Company
              </label>
              <input
                type="text"
                placeholder="e.g. Software Engineer — Stripe, or Backend Engineer — Google"
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Job Description Text
              </label>
              <textarea
                rows={10}
                placeholder="Paste the complete job posting including responsibilities, minimum qualifications, and nice-to-haves..."
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {jobDescriptionText.length} characters entered
              </span>

              <button
                onClick={handleSubmitJobDescription}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <span>Analyzing Posting...</span>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Analyze Job Description & Evaluate Gap</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Custom Role Title */}
      {activeTab === 'custom' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Enter Any Custom Target Career Title</h2>
            <p className="text-xs text-slate-600 mt-1">
              Want to pursue an emerging or niche role? Enter any job title and CareerPath AI will synthesize a provisional educational benchmark with a personalized 5-stage roadmap.
            </p>
          </div>

          <div className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Role Title
              </label>
              <input
                type="text"
                placeholder="e.g. MLOps Engineer, Robotics Vision Specialist, Quantum Software Engineer"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900">
              Note: Custom roles without an attached job description will be clearly labeled as a provisional benchmark.
            </div>

            <button
              onClick={handleSubmitCustomRole}
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span>Generating Benchmark...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Provisional Benchmark & 5-Stage Roadmap</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: 12 Established Benchmarks */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            You can also benchmark against our 12 standardized university software engineering tracks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benchmarkCareers.map((c) => (
              <div
                key={c.slug}
                className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{c.category}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{c.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">{c.description}</p>
                </div>

                <button
                  onClick={() => handleSelectBenchmark(c)}
                  disabled={loading}
                  className="w-full py-1.5 px-3 rounded-lg border border-slate-300 hover:border-indigo-500 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Select Benchmark
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
