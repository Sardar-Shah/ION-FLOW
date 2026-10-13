import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCode,
  BookOpen,
  Compass,
  TrendingUp,
  Cpu,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { api, IResumeProfile } from '../api.ts';

interface ResumeUploadViewProps {
  onAnalysisComplete: (profile: IResumeProfile) => void;
  onExploreHowItWorks: () => void;
}

export const ResumeUploadView: React.FC<ResumeUploadViewProps> = ({
  onAnalysisComplete,
  onExploreHowItWorks
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [samples, setSamples] = useState<Array<{ id: string; title: string; text: string }>>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string>('cs-sophomore');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample resumes on mount
  React.useEffect(() => {
    api.getResumeSamples()
      .then((res) => {
        if (res.samples && res.samples.length > 0) {
          setSamples(res.samples);
        }
      })
      .catch(() => {});
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const ext = f.name.toLowerCase().split('.').pop();
    if (!['pdf', 'docx', 'txt'].includes(ext || '')) {
      setError('Please provide a PDF, DOCX, or TXT file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }
    setError(null);
    setFile(f);
  };

  const handleSubmitAnalysis = async () => {
    setError(null);
    setLoading(true);

    try {
      if (activeTab === 'upload') {
        if (!file) {
          setError('Please select a resume file (PDF, DOCX, or TXT).');
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append('resumeFile', file);
        const res = await api.parseResumeFile(formData);
        if (res.success && res.profile) {
          onAnalysisComplete(res.profile);
        } else {
          setError(res.message || 'Failed to parse resume.');
        }
      } else if (activeTab === 'paste') {
        if (!pastedText || pastedText.trim().length < 30) {
          setError('Please paste your resume text (at least 30 characters).');
          setLoading(false);
          return;
        }
        const res = await api.parseResumeText(
          pastedText.trim(),
          candidateName ? `${candidateName.replace(/\s+/g, '_')}_Resume.txt` : 'Pasted_Resume.txt',
          'pasted'
        );
        if (res.success && res.profile) {
          onAnalysisComplete(res.profile);
        } else {
          setError(res.message || 'Failed to parse resume text.');
        }
      } else if (activeTab === 'samples') {
        const sample = samples.find((s) => s.id === selectedSampleId);
        if (!sample) {
          setError('Sample not found.');
          setLoading(false);
          return;
        }
        const res = await api.parseResumeText(sample.text, `${sample.id}_sample_resume.txt`, 'txt');
        if (res.success && res.profile) {
          onAnalysisComplete(res.profile);
        } else {
          setError(res.message || 'Failed to analyze sample resume.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during resume processing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs p-8 lg:p-12">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-md border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Career Intelligence for University Students</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Your Resume. <span className="text-indigo-600">Your Potential.</span> <br />Your Career Path.
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">
              Discover career opportunities that fit your skills, identify what employers expect, and build a personalized roadmap to become career-ready.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  const element = document.getElementById('resume-intake-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm"
              >
                <span>Analyze My Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreHowItWorks}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 active:bg-slate-300 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Explore How It Works</span>
              </button>
            </div>

            {/* Quiet metadata features */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Real Text Extraction (PDF/DOCX/TXT)
              </span>
              <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dynamic Recommendations
              </span>
              <span aria-hidden="true" className="mx-2 text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 5-Stage Learning Roadmaps
              </span>
            </div>
          </div>

          {/* Interactive Live Hero Showcase Widget */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-slate-800">Live Career Intelligence Engine</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Gemini 3.8 + Mongoose</span>
              </div>

              {/* Sample student snapshot card */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Alex Chen (UC Berkeley CS)</div>
                    <div className="text-[11px] text-slate-500">Analyzed Resume · 14 Extracted Skills</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-indigo-700">86% Fit</span>
                    <div className="text-[10px] text-slate-500">Full-Stack Track</div>
                  </div>
                </div>

                {/* Extracted Evidence Pill-less List */}
                <div className="text-[11px] space-y-1.5 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">React & TypeScript</span>
                    <span className="text-emerald-700 font-medium">Demonstrated (Project)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 italic line-clamp-1">
                    "Built full-stack collaborative editor with live syncing for 500+ users."
                  </div>
                </div>

                {/* 5-Stage preview tracker */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-600">Personalized 5-Stage Roadmap</span>
                    <span className="font-semibold text-slate-900">Stage 2 of 5</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 col-span-1 rounded-l-full" />
                    <div className="bg-indigo-600 col-span-1" />
                    <div className="bg-slate-300 col-span-1" />
                    <div className="bg-slate-300 col-span-1" />
                    <div className="bg-slate-300 col-span-1 rounded-r-full" />
                  </div>
                  <div className="text-[10px] text-slate-500 flex justify-between">
                    <span>1. Foundations</span>
                    <span>2. Core Skills</span>
                    <span>3. Practice</span>
                    <span>4. Projects</span>
                    <span>5. Launch</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-lg p-3 text-xs text-indigo-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Upload below or try 1-click university student samples to test immediately.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Intake Card */}
      <div id="resume-intake-section" className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-6 lg:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Step 1: Submit Your Resume</h2>
          <p className="text-sm text-slate-600 mt-1">
            We extract real skills, projects, experience, and education to match you against dynamic career opportunities.
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-md">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File (PDF / DOCX / TXT)</span>
          </button>

          <button
            onClick={() => setActiveTab('paste')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text Directly</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'samples' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sample Resumes</span>
          </button>
        </div>

        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-600 bg-indigo-50/50'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${file ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {file ? <CheckCircle2 className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                </div>

                {file ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {(file.size / 1024).toFixed(1)} KB · Ready for real text extraction
                    </p>
                    <p className="text-xs text-indigo-600 font-semibold mt-2 underline">Click to choose another file</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Drop your resume here, or <span className="text-indigo-600 underline">browse files</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, DOCX, and TXT up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Paste Resume Text */}
        {activeTab === 'paste' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Chen"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Resume Content
                </label>
                <span className="text-xs font-mono text-slate-500">
                  {pastedText.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={10}
                placeholder="Paste your education, skills, work experience, and projects here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full text-xs font-mono px-3.5 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Preset Student Resumes for Hackathon Testing */}
        {activeTab === 'samples' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              Select a pre-loaded university student resume to test the full intelligence pipeline instantly:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samples.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSampleId(s.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    selectedSampleId === s.id
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{s.title}</span>
                    {selectedSampleId === s.id && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {s.text.slice(0, 120)}...
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {activeTab === 'upload' && file ? `Selected: ${file.name}` : ''}
            {activeTab === 'paste' && pastedText ? `${pastedText.length} characters ready` : ''}
            {activeTab === 'samples' ? 'Pre-configured university sample ready' : ''}
          </div>

          <button
            onClick={handleSubmitAnalysis}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting & Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Resume</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
