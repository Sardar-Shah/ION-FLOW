import React, { useState } from 'react';
import {
  Search,
  Compass,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  ArrowRightLeft,
  Filter,
  Award
} from 'lucide-react';
import { ICareerSummary, ICareerDetail, api, IUser } from '../api.ts';
import { CareerDetailModal } from './CareerDetailModal.tsx';
import { CareerCompareModal } from './CareerCompareModal.tsx';

interface CareerExplorerViewProps {
  careers: ICareerSummary[];
  user: IUser | null;
  onSetTargetCareer: (slug: string) => void;
  onToggleFavoriteCareer: (slug: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const CareerExplorerView: React.FC<CareerExplorerViewProps> = ({
  careers,
  user,
  onSetTargetCareer,
  onToggleFavoriteCareer,
  onNavigateTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCareerDetail, setSelectedCareerDetail] = useState<ICareerDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [compareCareersData, setCompareCareersData] = useState<ICareerDetail[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  const categories = [
    'All',
    'Software Development',
    'Cybersecurity and Cloud',
    'Data and Artificial Intelligence',
    'Design',
    'Business and Management'
  ];

  const filteredCareers = careers.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.requiredSkillsSummary.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenDetail = async (slug: string) => {
    try {
      const res = await api.getCareerBySlug(slug);
      setSelectedCareerDetail(res.career);
      setModalOpen(true);
    } catch (err) {
      console.error('Failed to load career details', err);
    }
  };

  const toggleCompare = (slug: string) => {
    if (compareList.includes(slug)) {
      setCompareList(compareList.filter((s) => s !== slug));
    } else {
      if (compareList.length < 2) {
        setCompareList([...compareList, slug]);
      } else {
        setCompareList([compareList[1], slug]);
      }
    }
  };

  const handleLaunchCompare = async () => {
    if (compareList.length !== 2) return;
    try {
      const res = await api.compareCareers(compareList);
      setCompareCareersData(res.careers);
      setCompareModalOpen(true);
    } catch (err) {
      console.error('Failed to compare careers', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Explanation */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Explorer</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Explore 12 high-impact technology and management career paths. Every career features genuine required competencies, target proficiency benchmarks, learning resources, and portfolio projects.
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200 text-xs">
              <span className="font-medium text-indigo-900">
                Comparing ({compareList.length}/2): {compareList.join(', ')}
              </span>
              {compareList.length === 2 && (
                <button
                  onClick={handleLaunchCompare}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  View Side-by-Side
                </button>
              )}
            </div>
          )}
        </div>

        {/* Search and Category Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search careers by title, description, or skills (e.g., Python, Cloud, Security)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          {/* Interactive filter tabs (Zero-pill segmented style with buttons) */}
          <div className="flex items-center overflow-x-auto gap-1 p-1 bg-slate-100 rounded-lg no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCareers.map((career) => {
          const isTarget = user?.targetCareerSlug === career.slug;
          const isSaved = user?.savedCareers?.includes(career.slug);
          const isSelectedForCompare = compareList.includes(career.slug);

          return (
            <div
              key={career.slug}
              className={`bg-white rounded-xl border transition-all duration-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-md ${
                isTarget ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Unboxed Metadata (Zero-Pill discipline) */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>{career.category}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleFavoriteCareer(career.slug)}
                      className={`p-1 rounded transition-colors ${
                        isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Bookmark Career"
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      onClick={() => toggleCompare(career.slug)}
                      className={`p-1 rounded transition-colors ${
                        isSelectedForCompare ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Add to Comparison"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{career.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 mb-4">{career.description}</p>

                {/* Key Skills */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Required Core Skills ({career.requiredSkillsCount})
                  </div>
                  <div className="text-xs text-slate-700 space-y-1">
                    {career.requiredSkillsSummary.slice(0, 3).map((sk, i) => (
                      <div key={i} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <span className="truncate">{sk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenDetail(career.slug)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  View Profile
                </button>

                {isTarget ? (
                  <span className="text-xs font-semibold text-indigo-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Target Active</span>
                  </span>
                ) : (
                  <button
                    onClick={() => onSetTargetCareer(career.slug)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                  >
                    Select Target
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCareers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          <p className="text-sm font-medium">No careers match your search criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-2 text-xs text-indigo-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Career Details Modal */}
      <CareerDetailModal
        career={selectedCareerDetail}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSetTarget={(slug) => {
          onSetTargetCareer(slug);
          setModalOpen(false);
        }}
        isTarget={user?.targetCareerSlug === selectedCareerDetail?.slug}
        isSaved={!!user?.savedCareers?.includes(selectedCareerDetail?.slug || '')}
        onToggleFavorite={onToggleFavoriteCareer}
        onNavigateToAssessment={() => onNavigateTab('skills')}
      />

      {/* Career Compare Modal */}
      <CareerCompareModal
        careers={compareCareersData}
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        onSelectTarget={onSetTargetCareer}
        targetSlug={user?.targetCareerSlug}
      />
    </div>
  );
};
