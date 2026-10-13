import React from 'react';
import {
  X,
  Compass,
  CheckCircle2,
  BookOpen,
  FolderGit2,
  ExternalLink,
  Target,
  Sparkles,
  Bookmark,
  Award
} from 'lucide-react';
import { ICareerDetail } from '../api.ts';

interface CareerDetailModalProps {
  career: ICareerDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSetTarget: (slug: string) => void;
  isTarget: boolean;
  isSaved: boolean;
  onToggleFavorite: (slug: string) => void;
  onNavigateToAssessment: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  isOpen,
  onClose,
  onSetTarget,
  isTarget,
  isSaved,
  onToggleFavorite,
  onNavigateToAssessment
}) => {
  if (!isOpen || !career) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-3xl w-full p-6 text-slate-800 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold mb-1">
              <span>{career.category}</span>
              {isTarget && (
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[11px] font-bold">
                  Active Target Career
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{career.title}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">{career.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-1">
            <button
              onClick={() => onToggleFavorite(career.slug)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title="Save Career"
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            {!isTarget && (
              <button
                onClick={() => onSetTarget(career.slug)}
                className="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-xs"
              >
                Set as Target
              </button>
            )}
          </div>
        </div>

        {/* Responsibilities */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Typical Core Responsibilities
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {career.responsibilities.map((resp, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                <span className="text-slate-700">{resp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Required Skills Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Skill Profile ({career.requiredSkills.length} Core Competencies)
            </h4>
            <button
              onClick={() => {
                onClose();
                onNavigateToAssessment();
              }}
              className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1"
            >
              Assess My Skills <Target className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Skill Competency</th>
                  <th className="py-2.5 px-3 font-semibold">Domain</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Target Level</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Importance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {career.requiredSkills.map((skill, i) => (
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2 px-3">
                      <div className="font-medium text-slate-900">{skill.canonicalName}</div>
                      <div className="text-[11px] text-slate-500">{skill.description}</div>
                    </td>
                    <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{skill.category}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-slate-800 whitespace-nowrap">
                      Level {skill.targetLevel} / 5
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                          skill.importance === 'Required'
                            ? 'bg-rose-100 text-rose-800'
                            : skill.importance === 'Important'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {skill.importance} (W{skill.weight})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Portfolio Project Ideas */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Recommended Portfolio Projects
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {career.portfolioProjects.map((proj, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{proj.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium">
                    {proj.difficulty}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{proj.description}</p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Est. Effort: <span className="font-mono">{proj.estimatedHours}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Resources */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Verified Learning Resources
          </h4>
          <div className="space-y-2">
            {career.learningResources.map((res, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900">{res.title}</div>
                  <div className="text-[11px] text-slate-500">
                    {res.provider} · {res.resourceType} · {res.difficulty}
                  </div>
                </div>
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline font-medium shrink-0 ml-3"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Preparation Advice */}
        {career.preparationAdvice && career.preparationAdvice.length > 0 && (
          <div className="p-4 bg-indigo-50/70 rounded-lg border border-indigo-100 text-xs">
            <h5 className="font-semibold text-indigo-950 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Career Preparation Advice</span>
            </h5>
            <ul className="list-disc list-inside space-y-1 text-indigo-900/90 text-[11px]">
              {career.preparationAdvice.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
