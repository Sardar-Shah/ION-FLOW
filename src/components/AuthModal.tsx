import React, { useState } from 'react';
import { X, Lock, Mail, User, GraduationCap, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { api, setToken, IUser } from '../api.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: IUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [degree, setDegree] = useState('Computer Science & Engineering');
  const [currentSemester, setCurrentSemester] = useState('Year 3, Semester 1');
  const [targetInterest, setTargetInterest] = useState('cybersecurity-analyst');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        setToken(res.token);
        onAuthSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({
          name,
          email,
          password,
          degree,
          currentSemester,
          careerInterests: [targetInterest],
          initialSkills: [
            { skillName: 'Network Fundamentals & Protocols', level: 3, source: 'Coursework' },
            { skillName: 'Web Application Security (OWASP Top 10)', level: 2, source: 'Self-taught' },
            { skillName: 'Security Scripting (Python / Bash)', level: 2, source: 'Lab Project' }
          ]
        });
        setToken(res.token);
        onAuthSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fill buttons for judges and hackathon evaluators
  const handleDemoPreset = async (presetType: 'cyber' | 'fullstack' | 'data') => {
    setLoading(true);
    setError(null);

    let demoEmail = '';
    let demoPass = 'password123';
    let demoName = '';
    let demoDegree = '';
    let demoInterest = '';
    let demoSkills: { skillName: string; level: number; source: string }[] = [];

    if (presetType === 'cyber') {
      demoEmail = 'jane.cyber@university.edu';
      demoName = 'Jane Doe';
      demoDegree = 'Cybersecurity & Computer Science';
      demoInterest = 'cybersecurity-analyst';
      demoSkills = [
        { skillName: 'Network Fundamentals & Protocols', level: 3, source: 'Network Security Lab' },
        { skillName: 'Web Application Security (OWASP Top 10)', level: 2, source: 'OWASP Juice Shop' },
        { skillName: 'Security Scripting (Python / Bash)', level: 2, source: 'Automation Scripting' }
      ];
    } else if (presetType === 'fullstack') {
      demoEmail = 'alex.chen@university.edu';
      demoName = 'Alex Chen';
      demoDegree = 'Software Engineering';
      demoInterest = 'full-stack-developer';
      demoSkills = [
        { skillName: 'React & Client Architecture', level: 3, source: 'Frontend Course' },
        { skillName: 'Node.js & Express API Development', level: 2, source: 'Web Dev Lab' },
        { skillName: 'Full-Stack TypeScript', level: 2, source: 'Personal Projects' }
      ];
    } else {
      demoEmail = 'maria.data@university.edu';
      demoName = 'Maria Garcia';
      demoDegree = 'Data Science & Statistics';
      demoInterest = 'data-scientist';
      demoSkills = [
        { skillName: 'Python Scientific Ecosystem (Pandas, SciPy)', level: 3, source: 'Stats 201' },
        { skillName: 'Statistical Inference & Probability', level: 3, source: 'Probability Course' },
        { skillName: 'Machine Learning Algorithms (Scikit-Learn)', level: 2, source: 'ML Foundations' }
      ];
    }

    try {
      // First attempt login
      try {
        const loginRes = await api.login({ email: demoEmail, password: demoPass });
        setToken(loginRes.token);
        onAuthSuccess(loginRes.user);
        onClose();
        return;
      } catch {
        // If account does not exist, register automatically
      }

      const regRes = await api.register({
        name: demoName,
        email: demoEmail,
        password: demoPass,
        degree: demoDegree,
        currentSemester: 'Year 3, Semester 1',
        careerInterests: [demoInterest],
        initialSkills: demoSkills
      });
      setToken(regRes.token);
      onAuthSuccess(regRes.user);
      onClose();
    } catch (err: any) {
      setError(`Demo account setup error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 text-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900">
            {mode === 'login' ? 'Student Sign In' : 'Create Student Profile'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'login'
              ? 'Access your saved career roadmaps and skill assessments'
              : 'Join CareerPath AI to map skill gaps and personalized roadmaps'}
          </p>
        </div>

        {/* Quick Demo Selector for Evaluators */}
        <div className="p-3 mb-4 rounded-lg bg-indigo-50 border border-indigo-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Hackathon Quick-Sign In (1-Click Demo Profiles)</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoPreset('cyber')}
              disabled={loading}
              className="text-left px-2.5 py-1.5 rounded bg-white hover:bg-indigo-100/70 border border-indigo-200 text-xs font-medium text-slate-800 transition-colors flex items-center justify-between"
            >
              <span>Jane Doe · Cybersecurity Analyst</span>
              <ArrowRight className="w-3 h-3 text-indigo-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('fullstack')}
              disabled={loading}
              className="text-left px-2.5 py-1.5 rounded bg-white hover:bg-indigo-100/70 border border-indigo-200 text-xs font-medium text-slate-800 transition-colors flex items-center justify-between"
            >
              <span>Alex Chen · Full-Stack Developer</span>
              <ArrowRight className="w-3 h-3 text-indigo-600" />
            </button>
            <button
              type="button"
              onClick={() => handleDemoPreset('data')}
              disabled={loading}
              className="text-left px-2.5 py-1.5 rounded bg-white hover:bg-indigo-100/70 border border-indigo-200 text-xs font-medium text-slate-800 transition-colors flex items-center justify-between"
            >
              <span>Maria Garcia · Data Scientist</span>
              <ArrowRight className="w-3 h-3 text-indigo-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Degree / Major</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Target Career Interest</label>
                <select
                  value={targetInterest}
                  onChange={(e) => setTargetInterest(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="cybersecurity-analyst">Cybersecurity Analyst</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                  <option value="full-stack-developer">Full-Stack Developer</option>
                  <option value="cloud-engineer">Cloud Engineer</option>
                  <option value="data-analyst">Data Analyst</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="aiml-engineer">AI/ML Engineer</option>
                  <option value="ui-ux-designer">UI/UX Designer</option>
                  <option value="business-analyst">Business Analyst</option>
                  <option value="digital-marketer">Digital Marketer</option>
                  <option value="project-manager">Project Manager</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'login' ? (
              <span>Sign In to Dashboard</span>
            ) : (
              <span>Complete Registration</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
