import React, { useState, useEffect } from 'react';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  Layers,
  BookOpen,
  FolderGit2,
  TrendingUp,
  Server,
  UploadCloud,
  FileText,
  CheckCircle2
} from 'lucide-react';
import {
  api,
  IUser,
  ICareerSummary,
  ICareerDetail,
  IDashboardStats,
  IDatabaseStatus,
  IResumeProfile,
  ITargetRoleData,
  getToken,
  removeToken
} from './api.ts';
import { Navbar } from './components/Navbar.tsx';
import { DbStatusModal } from './components/DbStatusModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ResumeUploadView } from './components/ResumeUploadView.tsx';
import { ResumeReviewView } from './components/ResumeReviewView.tsx';
import { CareerDiscoveryView } from './components/CareerDiscoveryView.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CareerExplorerView } from './components/CareerExplorerView.tsx';
import { SkillsAssessmentView } from './components/SkillsAssessmentView.tsx';
import { GapAnalysisView } from './components/GapAnalysisView.tsx';
import { RoadmapView } from './components/RoadmapView.tsx';
import { PortfolioAndResourcesView } from './components/PortfolioAndResourcesView.tsx';
import { ProfileView } from './components/ProfileView.tsx';

export default function App() {
  const [user, setUser] = useState<IUser | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('resume-upload');
  const [careers, setCareers] = useState<ICareerSummary[]>([]);
  const [targetCareerDetail, setTargetCareerDetail] = useState<ICareerDetail | null>(null);
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null);
  const [dbStatus, setDbStatus] = useState<IDatabaseStatus | null>(null);

  // Resume-First & Target Role Intelligence State
  const [resumeProfile, setResumeProfile] = useState<IResumeProfile | null>(null);
  const [targetRoleData, setTargetRoleData] = useState<ITargetRoleData | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dbModalOpen, setDbModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    bootstrapApp();
  }, []);

  const bootstrapApp = async () => {
    setLoading(true);
    try {
      // 1. Fetch DB status diagnostics
      try {
        const dbRes = await api.getDatabaseStatus();
        setDbStatus(dbRes);
      } catch (dbErr) {
        console.warn('DB probe error', dbErr);
      }

      // 2. Fetch careers library
      try {
        const careersRes = await api.getCareers();
        setCareers(careersRes.careers);
      } catch (cErr) {
        console.warn('Careers fetch error', cErr);
      }

      // 3. Load latest resume profile if existing
      try {
        const resumeRes = await api.getLatestResume();
        if (resumeRes?.profile) {
          setResumeProfile(resumeRes.profile);
        }
      } catch (rErr) {
        console.warn('Resume load note:', rErr);
      }

      // 4. Load current target role if existing
      try {
        const roleRes = await api.getCurrentTargetRole();
        if (roleRes?.data) {
          setTargetRoleData(roleRes.data);
        }
      } catch (roleErr) {
        console.warn('Target role load note:', roleErr);
      }

      // 5. If token exists, load current user profile
      const token = getToken();
      if (token) {
        try {
          const userRes = await api.getMe();
          setUser(userRes.user);
          await loadUserRelatedData(userRes.user);
        } catch (authErr) {
          console.warn('Session expired or invalid token', authErr);
          removeToken();
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserRelatedData = async (currentUser: IUser) => {
    try {
      const statsRes = await api.getDashboardStats();
      setDashboardStats(statsRes);

      const targetSlug = currentUser.targetCareerSlug || 'full-stack-engineer';
      const detailRes = await api.getCareerBySlug(targetSlug);
      setTargetCareerDetail(detailRes.career);
    } catch (err) {
      console.error('Failed to load user-related data', err);
    }
  };

  const handleRefreshUserData = async () => {
    if (user) {
      try {
        const userRes = await api.getMe();
        setUser(userRes.user);
        await loadUserRelatedData(userRes.user);
      } catch (err) {
        console.error('Refresh error', err);
      }
    }

    // Also refresh current target role
    try {
      const roleRes = await api.getCurrentTargetRole();
      if (roleRes?.data) {
        setTargetRoleData(roleRes.data);
      }
    } catch {
      // transient
    }
  };

  const handleSetTargetCareer = async (slug: string) => {
    try {
      const res = await api.selectTargetRole({
        roleType: 'benchmark',
        slug,
        benchmarkSlug: slug
      });
      if (res.data) {
        setTargetRoleData(res.data);
      }
      if (user) {
        await api.setTargetCareer(slug);
        await handleRefreshUserData();
      }
      setCurrentTab('gap-analysis');
    } catch (err: any) {
      console.warn('Target career selection note:', err.message);
    }
  };

  const handleToggleFavoriteCareer = async (slug: string) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    try {
      const res = await api.toggleFavoriteCareer(slug);
      setUser({ ...user, savedCareers: res.savedCareers });
    } catch (err: any) {
      alert(`Favorite error: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setDashboardStats(null);
    setCurrentTab('resume-upload');
  };

  // Workflow Handlers
  const handleResumeAnalysisComplete = (profile: IResumeProfile) => {
    setResumeProfile(profile);
    setCurrentTab('resume-review');
  };

  const handleConfirmProfile = (reviewedProfile: IResumeProfile) => {
    setResumeProfile(reviewedProfile);
    setCurrentTab('career-discovery');
  };

  const handleRoleSelected = (roleData: ITargetRoleData) => {
    setTargetRoleData(roleData);
    setCurrentTab('gap-analysis');
  };

  const targetTitle = targetRoleData?.targetRole?.title || user?.targetCareerSlug || '';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar adhering to 3-zone contract */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        dbStatus={dbStatus}
        onOpenDbStatus={() => setDbModalOpen(true)}
        targetRoleTitle={targetTitle}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Step 1: Resume Upload & Analysis */}
        {currentTab === 'resume-upload' && (
          <ResumeUploadView
            onAnalysisComplete={handleResumeAnalysisComplete}
            onExploreHowItWorks={() => setCurrentTab('career-discovery')}
          />
        )}

        {/* Step 2: Resume Evidence Review */}
        {currentTab === 'resume-review' && (
          resumeProfile ? (
            <ResumeReviewView
              profile={resumeProfile}
              onConfirmProfile={handleConfirmProfile}
              onBackToUpload={() => setCurrentTab('resume-upload')}
            />
          ) : (
            <ResumeUploadView
              onAnalysisComplete={handleResumeAnalysisComplete}
              onExploreHowItWorks={() => setCurrentTab('career-discovery')}
            />
          )
        )}

        {/* Step 3: Dynamic Career Discovery & Target Role Selection */}
        {currentTab === 'career-discovery' && (
          <CareerDiscoveryView
            profile={resumeProfile}
            onSelectRole={handleRoleSelected}
            onNavigateToUpload={() => setCurrentTab('resume-upload')}
            benchmarkCareers={careers}
          />
        )}

        {/* Step 4: Skill-Gap Analysis */}
        {currentTab === 'gap-analysis' && (
          <GapAnalysisView
            careers={careers}
            targetCareerSlug={targetRoleData?.targetRole?.slug || 'full-stack-engineer'}
            onNavigateTab={setCurrentTab}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            targetRoleData={targetRoleData}
            resumeProfile={resumeProfile}
          />
        )}

        {/* Step 5: Exactly Five-Stage Learning Roadmap */}
        {currentTab === 'roadmap' && (
          <RoadmapView
            careers={careers}
            targetCareerSlug={targetRoleData?.targetRole?.slug || 'full-stack-engineer'}
            onRefreshStats={handleRefreshUserData}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            targetRoleData={targetRoleData}
          />
        )}

        {/* Step 6: Practical Projects & Readiness Verification */}
        {currentTab === 'portfolio' && (
          <PortfolioAndResourcesView
            careers={careers}
            targetCareerSlug={targetRoleData?.targetRole?.slug || 'full-stack-engineer'}
            onRefreshStats={handleRefreshUserData}
            user={user}
            onOpenAuth={() => setAuthModalOpen(true)}
            targetRoleData={targetRoleData}
          />
        )}

        {/* Step 7: Comprehensive Overview Dashboard */}
        {currentTab === 'dashboard' && (
          <DashboardView
            stats={dashboardStats}
            loading={loading}
            onNavigateTab={setCurrentTab}
            targetRoleData={targetRoleData}
            resumeProfile={resumeProfile}
          />
        )}

        {/* Step 8: Standard 12 Benchmarks Explorer (Preserved & accessible) */}
        {currentTab === 'careers' && (
          <CareerExplorerView
            careers={careers}
            user={user}
            onSetTargetCareer={handleSetTargetCareer}
            onToggleFavoriteCareer={handleToggleFavoriteCareer}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* User Skills Matrix (Preserved & accessible) */}
        {currentTab === 'skills' && (
          <SkillsAssessmentView
            user={user}
            targetCareerDetail={targetCareerDetail}
            onRefreshUserData={handleRefreshUserData}
            onNavigateTab={setCurrentTab}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {/* User Profile */}
        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            careers={careers}
            onRefreshUserData={handleRefreshUserData}
            onOpenDbModal={() => setDbModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-800">CareerPath AI</span>
            <span>·</span>
            <span>AI-Powered Career Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDbModalOpen(true)}
              className="hover:text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>MongoDB Atlas Connected</span>
            </button>
            <span>·</span>
            <span>Database: careerpath_ai</span>
            <span>·</span>
            <span>Cluster: ionflow.skdrbqo.mongodb.net</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal with Quick Demo Switcher */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={async (newUser) => {
          setUser(newUser);
          await loadUserRelatedData(newUser);
          setCurrentTab('dashboard');
        }}
      />

      {/* Database Diagnostics Modal */}
      <DbStatusModal
        status={dbStatus}
        isOpen={dbModalOpen}
        onClose={() => setDbModalOpen(false)}
        onRefresh={bootstrapApp}
      />
    </div>
  );
}
