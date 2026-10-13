import React, { useState } from 'react';
import { User, Mail, GraduationCap, Calendar, Clock, Compass, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { IUser, api, ICareerSummary } from '../api.ts';

interface ProfileViewProps {
  user: IUser | null;
  careers: ICareerSummary[];
  onRefreshUserData: () => void;
  onOpenDbModal: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  careers,
  onRefreshUserData,
  onOpenDbModal
}) => {
  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <p className="text-sm">Please sign in to view and edit your profile settings.</p>
      </div>
    );
  }

  const [name, setName] = useState(user.name || '');
  const [degree, setDegree] = useState(user.degree || 'Computer Science & Engineering');
  const [educationLevel, setEducationLevel] = useState(user.educationLevel || 'Undergraduate');
  const [currentSemester, setCurrentSemester] = useState(user.currentSemester || 'Year 3, Semester 1');
  const [preferredLearningPace, setPreferredLearningPace] = useState(user.preferredLearningPace || 'moderate');
  const [careerInterests, setCareerInterests] = useState<string[]>(user.careerInterests || []);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleInterest = (slug: string) => {
    if (careerInterests.includes(slug)) {
      setCareerInterests(careerInterests.filter((s) => s !== slug));
    } else {
      setCareerInterests([...careerInterests, slug]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);
    try {
      await api.updateProfile({
        name,
        degree,
        educationLevel,
        currentSemester,
        preferredLearningPace: preferredLearningPace as any,
        careerInterests
      });
      setSuccess('Profile updated successfully!');
      onRefreshUserData();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile & Preferences</h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure your academic standing, learning pace, and target career interests.
            </p>
          </div>
          <button
            onClick={onOpenDbModal}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Database Status
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Email (Account ID)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Degree / Academic Program</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Undergraduate">Undergraduate Student</option>
                <option value="Postgraduate">Postgraduate / Masters</option>
                <option value="Bootcamp / Self-paced">Bootcamp / Self-Paced</option>
                <option value="High School">High School Senior</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Current Academic Term</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Preferred Learning Pace</label>
              <select
                value={preferredLearningPace}
                onChange={(e) => setPreferredLearningPace(e.target.value as 'accelerated' | 'moderate' | 'relaxed')}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="accelerated">Accelerated (15+ hours/week)</option>
                <option value="moderate">Moderate (8–12 hours/week)</option>
                <option value="relaxed">Relaxed (3–5 hours/week)</option>
              </select>
            </div>
          </div>

          {/* Career Interests Multi-Select */}
          <div>
            <label className="block font-medium text-slate-700 mb-2">
              Career Interests (Select all that apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {careers.map((c) => {
                const selected = careerInterests.includes(c.slug);
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleInterest(c.slug)}
                    className={`p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between text-xs ${
                      selected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{c.title}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
