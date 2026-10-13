import {
  Compass,
  LayoutDashboard,
  Target,
  BarChart2,
  MapPin,
  FolderGit2,
  User,
  LogOut,
  Database,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  Sparkles
} from 'lucide-react';
import { IUser, IDatabaseStatus } from '../api.ts';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: IUser | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  dbStatus: IDatabaseStatus | null;
  onOpenDbStatus: () => void;
  targetRoleTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  onOpenAuth,
  dbStatus,
  onOpenDbStatus,
  targetRoleTitle
}) => {
  const navItems = [
    { id: 'resume-upload', label: 'Resume Intake', icon: UploadCloud },
    { id: 'career-discovery', label: 'Career Discovery', icon: Sparkles },
    { id: 'gap-analysis', label: 'Skill-Gap Engine', icon: BarChart2 },
    { id: 'roadmap', label: '5-Stage Roadmap', icon: MapPin },
    { id: 'portfolio', label: 'Projects & Evidence', icon: FolderGit2 },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'careers', label: '12 Benchmarks', icon: Compass }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-2.5 text-left text-slate-900 focus:outline-none group whitespace-nowrap shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              CareerPath AI
            </span>
            {targetRoleTitle ? (
              <span className="hidden sm:inline-block text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded ml-2 truncate max-w-[200px]">
                Target: {targetRoleTitle}
              </span>
            ) : (
              <span className="hidden sm:inline-block text-[11px] text-slate-500 font-normal ml-2">
                University Navigator
              </span>
            )}
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-indigo-700 bg-indigo-50 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action & Account Status */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Database Atlas Status Indicator */}
          <button
            onClick={onOpenDbStatus}
            title={dbStatus?.message || 'Database status'}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
          >
            {dbStatus?.connected ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="hidden sm:inline">
              {dbStatus?.connected ? 'Atlas Online' : 'DB Setup'}
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('profile')}
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  currentTab === 'profile'
                    ? 'bg-slate-200 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-medium max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
            >
              Sign In / Demo
            </button>
          )}
        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 gap-1.5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
