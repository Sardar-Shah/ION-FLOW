import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api, IResumeProfile, IExtractedSkill } from '../api.ts';

interface ResumeReviewViewProps {
  profile: IResumeProfile;
  onConfirmProfile: (updatedProfile: IResumeProfile) => void;
  onBackToUpload: () => void;
}

export const ResumeReviewView: React.FC<ResumeReviewViewProps> = ({
  profile,
  onConfirmProfile,
  onBackToUpload
}) => {
  const [skills, setSkills] = useState<IExtractedSkill[]>(profile.skills || []);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Languages');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterConfidence, setFilterConfidence] = useState<'all' | 'demonstrated' | 'partially_demonstrated' | 'inferred'>('all');

  const handleLevelChange = (index: number, newLevel: number) => {
    const updated = [...skills];
    updated[index].level = newLevel;
    setSkills(updated);
  };

  const handleRemoveSkill = (index: number) => {
    const updated = skills.filter((_, idx) => idx !== index);
    setSkills(updated);
  };

  const handleAddCustomSkill = () => {
    if (!newSkillName.trim()) return;
    const newEntry: IExtractedSkill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      evidence: 'Manually added and confirmed by candidate during review.',
      confidence: 'demonstrated',
      sourceSection: 'User Confirmed',
      isCustomAdded: true
    };
    setSkills([newEntry, ...skills]);
    setNewSkillName('');
    setIsAddingSkill(false);
  };

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const res = await api.reviewResume({
        skills,
        education: profile.education,
        experience: profile.experience,
        projects: profile.projects
      });
      if (res.success && res.profile) {
        onConfirmProfile(res.profile);
      } else {
        // Fallback local update
        onConfirmProfile({ ...profile, skills, isReviewed: true });
      }
    } catch {
      onConfirmProfile({ ...profile, skills, isReviewed: true });
    } finally {
      setSaving(false);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (filterConfidence === 'all') return true;
    return s.confidence === filterConfidence;
  });

  const demonstratedCount = skills.filter((s) => s.confidence === 'demonstrated').length;
  const inferredCount = skills.filter((s) => s.confidence === 'inferred').length;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md mb-2">
            <span>Step 2 of CareerPath AI Intelligence Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Review Extracted Resume Evidence</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Confirm, adjust, or supplement the capabilities identified from your resume. We distinguish demonstrated work from unconfirmed inferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToUpload}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
          >
            Re-Upload Resume
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors disabled:opacity-60"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>Confirm & Discover Careers</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Candidate Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Candidate</div>
          <div className="text-base font-bold text-slate-900">{profile.personalInfo?.fullName || 'Candidate'}</div>
          <div className="text-xs text-slate-500 mt-0.5">{profile.personalInfo?.email || 'Student Account'}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Education</div>
          <div className="text-sm font-bold text-slate-900 line-clamp-1">{profile.education?.[0]?.school || 'University'}</div>
          <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{profile.education?.[0]?.degree || 'Computer Science'}</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Demonstrated Evidence</div>
          <div className="text-base font-bold text-emerald-700">{demonstratedCount} Skills</div>
          <div className="text-xs text-slate-500 mt-0.5">Backed by project/experience text</div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">AI Inferences</div>
          <div className="text-base font-bold text-amber-700">{inferredCount} Skills</div>
          <div className="text-xs text-slate-500 mt-0.5">Listed in skills line; pending verification</div>
        </div>
      </div>

      {/* Skills Evidence Review Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Extracted Skills & Resume Evidence</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and adjust proficiency levels (1-5). Ratings inform your skill-gap evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs">
              <button
                onClick={() => setFilterConfidence('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterConfidence === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({skills.length})
              </button>
              <button
                onClick={() => setFilterConfidence('demonstrated')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterConfidence === 'demonstrated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demonstrated ({demonstratedCount})
              </button>
              <button
                onClick={() => setFilterConfidence('inferred')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterConfidence === 'inferred' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inferred ({inferredCount})
              </button>
            </div>

            <button
              onClick={() => setIsAddingSkill(!isAddingSkill)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Missing Skill</span>
            </button>
          </div>
        </div>

        {/* Add Skill Form Drawer */}
        {isAddingSkill && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Skill Name</label>
              <input
                type="text"
                placeholder="e.g. Docker, GraphQL, Kubernetes"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Databases">Databases</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data & AI">Data & AI</option>
                <option value="Developer Tools">Developer Tools</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Proficiency Level (1-5)</label>
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value={1}>1 — Novice / Fundamental</option>
                <option value={2}>2 — Basic Working Knowledge</option>
                <option value={3}>3 — Intermediate Practical</option>
                <option value={4}>4 — Advanced Competency</option>
                <option value={5}>5 — Expert / Architect</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddCustomSkill}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
              >
                Confirm Add
              </button>
              <button
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-2 rounded-lg text-slate-600 text-xs hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Skills Evidence Table */}
        <div className="divide-y divide-slate-100">
          {filteredSkills.map((skill, idx) => {
            const actualIndex = skills.indexOf(skill);
            return (
              <div key={`${skill.name}-${idx}`} className="py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{skill.name}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{skill.category}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className={`text-[11px] font-medium ${
                      skill.confidence === 'demonstrated' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {skill.confidence === 'demonstrated' ? 'Demonstrated Evidence' : 'Unconfirmed / Inferred'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic pl-2 border-l-2 border-slate-200">
                    "{skill.evidence}"
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  {/* Rating Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 font-medium mr-1">Level:</span>
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleLevelChange(actualIndex, lvl)}
                        className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                          skill.level === lvl
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title={`Level ${lvl} of 5`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => handleRemoveSkill(actualIndex)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            No skills matching current filter.
          </div>
        )}
      </div>

      {/* Extracted Projects & Experience Snippets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Extracted Projects ({profile.projects?.length || 0})</h3>
          </div>

          <div className="space-y-3">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((proj, pIdx) => (
                <div key={pIdx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{proj.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {proj.techStack?.join(', ') || 'Software'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {proj.description || proj.highlights?.join(' ')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No project sections identified.</p>
            )}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Extracted Experience & Roles ({profile.experience?.length || 0})</h3>
          </div>

          <div className="space-y-3">
            {profile.experience && profile.experience.length > 0 ? (
              profile.experience.map((exp, eIdx) => (
                <div key={eIdx} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900">{exp.role}</span>
                    <span className="text-[10px] text-slate-500">{exp.duration}</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium">{exp.company}</div>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {exp.highlights?.join(' ')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No formal employment entries extracted.</p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Bottom Sticky Bar */}
      <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-indigo-900">Ready to Discover Tailored Careers?</h4>
          <p className="text-xs text-indigo-700 mt-0.5">
            We will evaluate your verified capabilities across real industry career directions and job descriptions.
          </p>
        </div>

        <button
          onClick={handleConfirm}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-colors"
        >
          <span>Confirm & Discover Careers</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
