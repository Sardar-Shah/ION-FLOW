import React from 'react';
import { X, ArrowRightLeft, Target, BookOpen, FolderGit2 } from 'lucide-react';
import { ICareerDetail } from '../api.ts';

interface CareerCompareModalProps {
  careers: ICareerDetail[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTarget: (slug: string) => void;
  targetSlug?: string;
}

export const CareerCompareModal: React.FC<CareerCompareModalProps> = ({
  careers,
  isOpen,
  onClose,
  onSelectTarget,
  targetSlug
}) => {
  if (!isOpen || careers.length < 2) return null;

  const [careerA, careerB] = careers;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full p-6 text-slate-800 relative my-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-slate-200 pb-3">
          <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">Career Comparison Matrix</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Career A Column */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600">{careerA.category}</span>
              <h3 className="text-base font-bold text-slate-900">{careerA.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-3">{careerA.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Required Skills ({careerA.requiredSkills.length})</h4>
              <div className="space-y-1 text-xs">
                {careerA.requiredSkills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="font-medium text-slate-800">{s.canonicalName}</span>
                    <span className="font-mono text-slate-600">L{s.targetLevel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1">Portfolio Projects</h4>
              <p className="text-xs text-slate-600">{careerA.portfolioProjects.length} guided projects included</p>
            </div>

            <button
              onClick={() => {
                onSelectTarget(careerA.slug);
                onClose();
              }}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                targetSlug === careerA.slug
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {targetSlug === careerA.slug ? 'Current Target Career' : `Set as Target: ${careerA.title}`}
            </button>
          </div>

          {/* Career B Column */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600">{careerB.category}</span>
              <h3 className="text-base font-bold text-slate-900">{careerB.title}</h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-3">{careerB.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-2">Required Skills ({careerB.requiredSkills.length})</h4>
              <div className="space-y-1 text-xs">
                {careerB.requiredSkills.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-slate-200/60">
                    <span className="font-medium text-slate-800">{s.canonicalName}</span>
                    <span className="font-mono text-slate-600">L{s.targetLevel}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 mb-1">Portfolio Projects</h4>
              <p className="text-xs text-slate-600">{careerB.portfolioProjects.length} guided projects included</p>
            </div>

            <button
              onClick={() => {
                onSelectTarget(careerB.slug);
                onClose();
              }}
              className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                targetSlug === careerB.slug
                  ? 'bg-slate-200 text-slate-800'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
              }`}
            >
              {targetSlug === careerB.slug ? 'Current Target Career' : `Set as Target: ${careerB.title}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
