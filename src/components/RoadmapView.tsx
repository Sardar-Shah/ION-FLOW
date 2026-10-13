import React, { useState, useEffect } from 'react';
import {
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  FolderGit2,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { IRoadmapData, api, ICareerSummary, IUser, ITargetRoleData } from '../api.ts';

interface RoadmapViewProps {
  careers: ICareerSummary[];
  targetCareerSlug: string;
  onRefreshStats: () => void;
  user?: IUser | null;
  onOpenAuth?: () => void;
  targetRoleData?: ITargetRoleData | null;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  careers,
  targetCareerSlug,
  onRefreshStats,
  user,
  onOpenAuth,
  targetRoleData
}) => {
  const [selectedSlug, setSelectedSlug] = useState(targetCareerSlug || 'full-stack-engineer');
  const [roadmap, setRoadmap] = useState<IRoadmapData | null>(targetRoleData?.roadmap || null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true
  });

  useEffect(() => {
    if (targetRoleData?.roadmap) {
      setRoadmap(targetRoleData.roadmap);
    } else if (selectedSlug) {
      loadRoadmap(selectedSlug);
    }
  }, [selectedSlug, targetRoleData]);

  const loadRoadmap = async (slug: string) => {
    setLoading(true);
    try {
      const res = await api.getRoadmap(slug);
      if (res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err: any) {
      console.warn('Roadmap load note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStage = (stageNumber: number) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageNumber]: !prev[stageNumber]
    }));
  };

  const handleStatusChange = async (
    stageNumber: number,
    milestoneId: string,
    newStatus: 'not_started' | 'in_progress' | 'completed'
  ) => {
    if (!roadmap) return;

    // Optimistically update locally
    let completedCount = 0;
    let totalCount = 0;

    const updatedStages = roadmap.stages.map((st) => {
      const updatedMilestones = st.milestones.map((m) => {
        totalCount++;
        if (st.stageNumber === stageNumber && m.milestoneId === milestoneId) {
          const updatedM = {
            ...m,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
          };
          if (newStatus === 'completed') completedCount++;
          return updatedM;
        }
        if (m.status === 'completed') completedCount++;
        return m;
      });
      return { ...st, milestones: updatedMilestones };
    });

    const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    setRoadmap({
      ...roadmap,
      stages: updatedStages,
      totalMilestones: totalCount,
      completedMilestones: completedCount,
      progressPercentage: newProgress
    });

    onRefreshStats();

    // Call API if slug available
    try {
      const slug = targetRoleData?.targetRole?.slug || selectedSlug;
      await api.updateMilestoneStatus(slug, milestoneId, newStatus);
    } catch {
      // transient local mode persists in targetRoleData
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const slug = targetRoleData?.targetRole?.slug || selectedSlug;
      const res = await api.regenerateRoadmap(slug);
      if (res.roadmap) {
        setRoadmap(res.roadmap);
        onRefreshStats();
      }
    } catch (err: any) {
      console.warn('Regenerate note:', err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const careerTitle = targetRoleData?.targetRole?.title || roadmap?.careerTitle || 'Your Target Role';
  const progressPercent = roadmap?.progressPercentage ?? 0;
  const completedCount = roadmap?.completedMilestones ?? 0;
  const totalCount = roadmap?.totalMilestones ?? 10;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
            <span>Step 5: Exactly Five Ordered Learning Stages</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Personalized 5-Stage Learning Roadmap</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Targeting: <strong className="text-slate-900">{careerTitle}</strong>. Designed to bridge your verified gaps from foundational concepts to capstone readiness.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-2xl font-extrabold text-indigo-700">{progressPercent}%</span>
            <div className="text-xs text-slate-500 font-mono">
              {completedCount} of {totalCount} Completed
            </div>
          </div>

          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 hover:border-indigo-400 bg-white text-slate-700 font-semibold text-xs shadow-xs transition-colors disabled:opacity-50"
            title="Regenerate roadmap based on latest skills (preserves completed milestones)"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Roadmap</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Across 5 Stages */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>5-Stage Progression</span>
          <span className="font-mono text-indigo-700">{progressPercent}% Complete</span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-5 text-[11px] text-slate-500 font-medium text-center pt-1">
          <span>Stage 1: Foundation</span>
          <span>Stage 2: Core Skills</span>
          <span>Stage 3: Applied Practice</span>
          <span>Stage 4: Portfolio Projects</span>
          <span>Stage 5: Career Launch</span>
        </div>
      </div>

      {/* Five Ordered Stages */}
      <div className="space-y-6">
        {roadmap?.stages?.map((stage) => {
          const isExpanded = expandedStages[stage.stageNumber] ?? true;
          const stageMilestones = stage.milestones || [];
          const stageCompleted = stageMilestones.filter((m) => m.status === 'completed').length;
          const stageTotal = stageMilestones.length;

          return (
            <div
              key={stage.stageNumber}
              className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden transition-all"
            >
              {/* Stage Header */}
              <div
                onClick={() => handleToggleStage(stage.stageNumber)}
                className="p-5 lg:p-6 bg-slate-50/70 border-b border-slate-200/80 cursor-pointer flex items-center justify-between hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {stage.stageNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{stage.stageName}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {stageMilestones.length} Milestones · {stageCompleted} Completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-xs font-mono text-slate-500">
                    {stageTotal > 0 ? Math.round((stageCompleted / stageTotal) * 100) : 0}%
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Milestones in Stage */}
              {isExpanded && (
                <div className="p-5 lg:p-6 divide-y divide-slate-100 space-y-6">
                  {stageMilestones.map((m) => (
                    <div key={m.milestoneId} className="pt-6 first:pt-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{m.title}</span>
                            {m.isGapTargeted && (
                              <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Gap-Targeted
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <strong>Objective:</strong> {m.learningObjective}
                          </p>
                        </div>

                        {/* Status Toggle Buttons */}
                        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start shrink-0">
                          <button
                            onClick={() => handleStatusChange(stage.stageNumber, m.milestoneId, 'not_started')}
                            className={`px-2.5 py-1 rounded font-medium transition-colors ${
                              m.status === 'not_started'
                                ? 'bg-white text-slate-800 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            To Do
                          </button>
                          <button
                            onClick={() => handleStatusChange(stage.stageNumber, m.milestoneId, 'in_progress')}
                            className={`px-2.5 py-1 rounded font-medium transition-colors ${
                              m.status === 'in_progress'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => handleStatusChange(stage.stageNumber, m.milestoneId, 'completed')}
                            className={`px-2.5 py-1 rounded font-medium transition-colors ${
                              m.status === 'completed'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            Completed
                          </button>
                        </div>
                      </div>

                      {/* Practical Task & Completion Criteria */}
                      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
                        <div>
                          <strong className="text-slate-800">Practical Task:</strong>{' '}
                          <span className="text-slate-600">{m.practicalTask}</span>
                        </div>
                        <div>
                          <strong className="text-slate-800">Completion Criteria:</strong>{' '}
                          <span className="text-slate-600">{m.completionCriteria}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-y-1 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span>
                            <strong>Estimated Effort:</strong> {m.estimatedEffort}
                          </span>
                          <span className="mx-2 text-slate-300">·</span>
                          <span>
                            <strong>Covered Skills:</strong> {m.skillsCovered?.join(', ') || 'Core'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
