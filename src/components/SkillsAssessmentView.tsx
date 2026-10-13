import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Info,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { IUser, IUserSkill, api, ICareerDetail } from '../api.ts';

interface SkillsAssessmentViewProps {
  user: IUser | null;
  targetCareerDetail: ICareerDetail | null;
  onRefreshUserData: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenAuth?: () => void;
}

export const SkillsAssessmentView: React.FC<SkillsAssessmentViewProps> = ({
  user,
  targetCareerDetail,
  onRefreshUserData,
  onNavigateTab,
  onOpenAuth
}) => {
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState(3);
  const [source, setSource] = useState('Coursework');
  const [evidence, setEvidence] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick rating state for target career checklist
  const [quickRatings, setQuickRatings] = useState<Record<string, number>>({});
  const [savingBatch, setSavingBatch] = useState(false);

  const proficiencyLevels = [
    { level: 0, label: 'Level 0 — No Experience', desc: 'No prior exposure or practical practice' },
    { level: 1, label: 'Level 1 — Beginner', desc: 'Familiar with basic concepts, terms, and syntax' },
    { level: 2, label: 'Level 2 — Basic', desc: 'Can build simple tasks with guidance or documentation' },
    { level: 3, label: 'Level 3 — Intermediate', desc: 'Able to work independently on standard problems' },
    { level: 4, label: 'Level 4 — Advanced', desc: 'Deep fluency, optimizes performance, debugs complex edge cases' },
    { level: 5, label: 'Level 5 — Proficient', desc: 'Comprehensive domain mastery, architect-level knowledge' }
  ];

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.saveUserSkill({
        skillName: skillName.trim(),
        level,
        source,
        evidence
      });
      setSuccessMsg(`Skill assessment for "${skillName}" saved!`);
      setSkillName('');
      setLevel(3);
      setEvidence('');
      setEditingSkill(null);
      onRefreshUserData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save skill');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s: IUserSkill) => {
    setSkillName(s.skillName);
    setLevel(s.level);
    setSource(s.source || 'Coursework');
    setEvidence(s.evidence || '');
    setEditingSkill(s.skillName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (sName: string) => {
    if (!confirm(`Are you sure you want to remove ${sName} from your profile?`)) return;
    try {
      await api.deleteUserSkill(sName);
      onRefreshUserData();
    } catch (err: any) {
      alert(`Delete error: ${err.message}`);
    }
  };

  // Quick Rate batch submit for target career requirements
  const handleQuickRateSubmit = async () => {
    if (!targetCareerDetail) return;
    setSavingBatch(true);
    try {
      const batchPayload = targetCareerDetail.requiredSkills.map((req) => {
        const rating = quickRatings[req.canonicalName] !== undefined
          ? quickRatings[req.canonicalName]
          : user?.assessedSkills?.find((us) => us.skillName.toLowerCase() === req.canonicalName.toLowerCase())?.level || 0;
        return {
          skillName: req.canonicalName,
          level: rating,
          source: 'Career Target Checklist',
          evidence: ''
        };
      });

      await api.saveUserSkillsBatch(batchPayload);
      setSuccessMsg(`Batch assessment for ${targetCareerDetail.title} saved successfully!`);
      onRefreshUserData();
    } catch (err: any) {
      setErrorMsg(`Batch error: ${err.message}`);
    } finally {
      setSavingBatch(false);
    }
  };

  const userSkills = user?.assessedSkills || [];

  return (
    <div className="space-y-6">
      {/* Header and Self-Reporting Transparency Notice */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Skills & Self-Assessment</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Maintain an accurate profile of your software, data, and management competencies. All ratings are self-reported unless supported by project links or verification evidence.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('gap-analysis')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs shrink-0"
          >
            Run Skill-Gap Analysis
          </button>
        </div>

        {!user && (
          <div className="mt-4 p-3.5 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-900">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                <strong>Guest Exploration Session:</strong> You can rate and test skills right now. To link your assessments to MongoDB Atlas and save your profile, sign in or launch a demo profile.
              </span>
            </div>
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded text-xs shrink-0 transition-colors"
              >
                Sign In / Demo
              </button>
            )}
          </div>
        )}

        {/* Proficiency Scale Reference Card */}
        <div className="mt-5 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
            <Info className="w-4 h-4 text-indigo-600" />
            <span>Standardized 6-Point Proficiency Scale</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {proficiencyLevels.map((p) => (
              <div key={p.level} className="bg-white p-2.5 rounded border border-slate-200">
                <div className="font-semibold text-slate-900">{p.label}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Target Career Quick-Rate Checklist (Instant onboarding accelerator) */}
      {targetCareerDetail && (
        <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Quick Assessment for Target Career: {targetCareerDetail.title}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rate your proficiency against each required skill below to generate an immediate, accurate gap analysis.
              </p>
            </div>
            <button
              onClick={handleQuickRateSubmit}
              disabled={savingBatch}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors shadow-xs shrink-0"
            >
              {savingBatch ? 'Saving...' : 'Save All Career Ratings'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {targetCareerDetail.requiredSkills.map((req, idx) => {
              const existingSkill = userSkills.find(
                (us) => us.skillName.toLowerCase() === req.canonicalName.toLowerCase()
              );
              const currentRating = quickRatings[req.canonicalName] !== undefined
                ? quickRatings[req.canonicalName]
                : existingSkill?.level || 0;

              return (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between text-xs gap-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{req.canonicalName}</div>
                      <div className="text-[11px] text-slate-500">
                        Target Level: <span className="font-mono font-bold text-indigo-600">L{req.targetLevel}</span> ({req.importance})
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Level {currentRating}/5
                    </span>
                  </div>

                  {/* Level selector buttons 0 through 5 */}
                  <div className="flex items-center gap-1 pt-1">
                    {[0, 1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() =>
                          setQuickRatings({
                            ...quickRatings,
                            [req.canonicalName]: lvl
                          })
                        }
                        className={`flex-1 py-1 rounded text-[11px] font-semibold transition-colors ${
                          currentRating === lvl
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit Skill Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-3">
          {editingSkill ? `Edit Assessment: ${editingSkill}` : 'Add or Assess Any Skill'}
        </h2>

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveSkill} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Skill Name</label>
            <input
              type="text"
              required
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. Docker, TypeScript, SQL"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Self-Reported Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {proficiencyLevels.map((p) => (
                <option key={p.level} value={p.level}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Learning Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Coursework">University Coursework</option>
              <option value="Self-taught">Self-taught / Online Platform</option>
              <option value="Internship">Internship / Job Experience</option>
              <option value="Project">Personal Portfolio Project</option>
              <option value="Certification">Industry Certification</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Evidence / Notes (Optional)</label>
            <input
              type="text"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              placeholder="e.g. GitHub repo link or coursework code"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-end gap-2 pt-2">
            {editingSkill && (
              <button
                type="button"
                onClick={() => {
                  setEditingSkill(null);
                  setSkillName('');
                  setLevel(3);
                }}
                className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingSkill ? 'Update Assessment' : 'Add to Skill Profile'}
            </button>
          </div>
        </form>
      </div>

      {/* Student's Current Assessed Skills List */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Assessed Skills Portfolio</h2>
            <p className="text-xs text-slate-500">
              {userSkills.length} competencies registered in your student profile
            </p>
          </div>
        </div>

        {userSkills.length > 0 ? (
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Skill</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Self-Reported Level</th>
                  <th className="py-2.5 px-3 font-semibold">Learning Source</th>
                  <th className="py-2.5 px-3 font-semibold">Evidence / Notes</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {userSkills.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900">{s.skillName}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Level {s.level} / 5
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{s.source || 'Self-reported'}</td>
                    <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{s.evidence || '—'}</td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(s)}
                        className="p-1 text-slate-500 hover:text-indigo-600 rounded transition-colors mr-1"
                        title="Edit Skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.skillName)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded transition-colors"
                        title="Delete Skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-lg text-slate-500 text-xs">
            <Target className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No skills assessed yet.</p>
            <p className="mt-1">Add your skills above or use the quick checklist to rate requirements for your target career.</p>
          </div>
        )}
      </div>
    </div>
  );
};
