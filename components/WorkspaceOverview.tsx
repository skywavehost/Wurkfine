
import React, { useState, useMemo, useRef } from 'react';
import { 
  Star, ChevronDown, MoreHorizontal, UserPlus, Info, 
  MessageSquare, Briefcase, Target, Plus, Circle,
  LayoutList, Layout as LayoutIcon, Folder, X, PlusCircle,
  FileText, Calendar, BookOpen, CheckCircle
} from 'lucide-react';
import TeamSettingsModal from './TeamSettingsModal';
import AddWorkModal from './AddWorkModal';
import InviteTeammatesModal from './InviteTeammatesModal';
import CreateWorkDropdown from './CreateWorkDropdown';
import { Project } from '../types';

interface OnboardingStatus {
  description: boolean;
  work: boolean;
  teammates: boolean;
}

interface WorkspaceOverviewProps {
  projects: Project[];
}

const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({ projects }) => {
  const tabs = ['Overview', 'Members', 'All work', 'Messages', 'Calendar', 'Knowledge'];
  const [activeTab, setActiveTab] = useState('Overview');
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateWorkMenuOpen, setIsCreateWorkMenuOpen] = useState(false);
  
  const createWorkBtnRef = useRef<HTMLButtonElement>(null);

  // Dynamic onboarding state
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus>({
    description: false,
    work: false,
    teammates: false
  });

  const completedSteps = useMemo(() => {
    return Object.values(onboardingStatus).filter(Boolean).length;
  }, [onboardingStatus]);

  const totalSteps = 3;
  const circumference = 62.83; // 2 * PI * r (r=10)
  const strokeDashoffset = circumference - (completedSteps / totalSteps) * circumference;

  const handleUpdateDescription = (hasDescription: boolean) => {
    if (hasDescription) {
      setOnboardingStatus(prev => ({ ...prev, description: true }));
    }
  };

  const handleAddWorkComplete = () => {
    setOnboardingStatus(prev => ({ ...prev, work: true }));
  };

  const handleInviteComplete = () => {
    setOnboardingStatus(prev => ({ ...prev, teammates: true }));
  };

  const handleCreateWorkSelect = (type: 'project' | 'template') => {
    if (type === 'project') {
      setIsAddWorkOpen(true);
    }
    setIsCreateWorkMenuOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1f21] h-full overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      {/* Header / Sub-nav */}
      <div className="px-5 pt-4 pb-0 flex flex-col flex-shrink-0 bg-[#1e1f21] border-b border-[#333538] sticky top-0 z-30">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#3c4043] flex items-center justify-center text-[11px] font-bold text-white">M</div>
            <h1 className="text-[16px] font-bold text-white tracking-tight">My workspace</h1>
            <Star size={14} className="text-[#a2a0a2] hover:text-yellow-400 transition-colors cursor-pointer ml-1" />
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-7 h-7 rounded-full bg-pink-500 flex items-center justify-center text-[10px] font-bold text-white mr-1 shadow-sm">TT</div>
             <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#4573d2] rounded-md hover:bg-[#5a87e5] transition-colors text-white font-medium text-[12px] shadow-sm"
             >
               <UserPlus size={14} strokeWidth={2.5} />
               <span>Invite</span>
             </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-6 px-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-[13px] font-medium transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
              )}
            </button>
          ))}
          <button className="pb-2.5 text-[#a2a0a2] hover:text-white">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Hero Banner Background */}
      <div className="h-[120px] bg-[#333538] w-full flex-shrink-0" />

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto w-full px-12 -mt-10 pb-20 relative z-10">
        
        {/* Hero Section Card */}
        <div className="flex items-end justify-between mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#1e1f21] p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-[#3c4043] flex items-center justify-center text-[44px] font-bold text-white/90 border border-white/10">
                M
              </div>
            </div>
            <div className="pb-1">
               <h2 className="text-[24px] font-bold text-white tracking-tight leading-none mb-2">My workspace</h2>
               <p className="text-[#a2a0a2] text-[13px] cursor-pointer hover:underline opacity-80 italic">Click to add team description...</p>
            </div>
          </div>
          <div className="pb-1">
            <button 
              ref={createWorkBtnRef}
              onClick={() => setIsCreateWorkMenuOpen(!isCreateWorkMenuOpen)}
              className={`flex items-center space-x-2 px-3 py-1.5 bg-[#2a2b2d] border rounded-md hover:bg-[#333538] transition-all text-[13px] font-medium text-white shadow-sm group ${
                isCreateWorkMenuOpen ? 'border-white' : 'border-[#333538]'
              }`}
            >
              <span>Create work</span>
              <ChevronDown 
                size={14} 
                className={`text-[#a2a0a2] group-hover:text-white transition-transform duration-200 ${isCreateWorkMenuOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            {isCreateWorkMenuOpen && (
              <CreateWorkDropdown 
                anchorRef={createWorkBtnRef}
                onClose={() => setIsCreateWorkMenuOpen(false)}
                onSelect={handleCreateWorkSelect}
              />
            )}
          </div>
        </div>

        {/* Setup Onboarding Card */}
        {showOnboarding && (
          <div className="bg-[#1e1f21] border border-[#333538] rounded-xl p-6 shadow-xl mb-12 relative group/onboarding">
             <button 
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-[#a2a0a2] hover:text-white transition-colors p-1"
             >
               <X size={16} />
             </button>

             <div className="flex items-center gap-3 mb-6">
                <h3 className="text-[14px] font-bold text-white tracking-tight">Finish setting up your team</h3>
                <div className="flex items-center gap-2">
                   <div className="relative w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-full h-full transform -rotate-90">
                         <circle cx="12" cy="12" r="10" stroke="#3a3b3c" strokeWidth="2" fill="none" />
                         <circle 
                            cx="12" cy="12" r="10" 
                            stroke="#45d08e" 
                            strokeWidth="2" 
                            fill="none" 
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            className="transition-all duration-700 ease-out" 
                         />
                      </svg>
                   </div>
                   <p className="text-[12px] font-medium">
                      <span className={completedSteps > 0 ? 'text-[#45d08e]' : 'text-[#a2a0a2]'}>
                        {completedSteps} of {totalSteps} steps
                      </span>
                      <span className="text-[#a2a0a2] ml-1">completed</span>
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <SetupActionCard 
                  icon={<FileText size={18} className="text-white" />} 
                  title="Add team description" 
                  description="Describe your team's purpose and responsibilities" 
                  onClick={() => setIsSettingsOpen(true)}
                  isComplete={onboardingStatus.description}
                />
                <SetupActionCard 
                  icon={<Briefcase size={18} className="text-white" />} 
                  title="Add work" 
                  description="Link existing projects, portfolios, or templates your team may find helpful" 
                  onClick={() => setIsAddWorkOpen(true)}
                  isComplete={onboardingStatus.work}
                />
                <SetupActionCard 
                  icon={<UserPlus size={18} className="text-white" />} 
                  title="Add teammates" 
                  description="Start collaborating by inviting teammates to your new team" 
                  onClick={() => setIsInviteModalOpen(true)}
                  isComplete={onboardingStatus.teammates}
                />
             </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
           
           {/* Left Column: Curated Work (Span 7) */}
           <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-[18px] font-bold text-white tracking-tight">Curated work</h3>
                 <button className="text-[12px] font-semibold text-[#a2a0a2] hover:text-white transition-all flex items-center space-x-1">
                    <span>View all work</span>
                 </button>
              </div>

              <div className="bg-[#1e1f21] border border-[#333538] rounded-xl p-2 pb-10 space-y-1">
                 <CuratedWorkItem icon={<LayoutList size={18} className="text-[#4ade80]" />} />
                 <CuratedWorkItem icon={<LayoutIcon size={18} className="text-[#a2a0a2]" />} />
                 <CuratedWorkItem icon={<Folder size={18} className="text-[#4573d2]" />} />
                 
                 <div className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-4">
                    <p className="text-[13px] text-[#a2a0a2] max-sm leading-relaxed opacity-80">
                      Organize links to important work such as portfolios, projects, templates, etc, for your team members to find easily.
                    </p>
                    <button 
                      onClick={() => setIsAddWorkOpen(true)}
                      className="px-5 py-2 bg-[#4573d2] hover:bg-[#5a87e5] rounded-md text-[13px] font-semibold text-white transition-all shadow-md active:scale-[0.98]"
                    >
                       Add work
                    </button>
                 </div>
              </div>
           </div>

           {/* Right Column: Members & Goals (Span 3) */}
           <div className="lg:col-span-3 space-y-6">
              {/* Members Section */}
              <section className="bg-[#1e1f21] border border-[#333538] rounded-xl p-5 flex flex-col space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-white">Members</h3>
                    <button className="text-[11px] font-bold text-[#a2a0a2] hover:underline uppercase tracking-wider">View all 1</button>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-[#1e1f21] shadow-lg cursor-pointer">
                       TT
                    </div>
                    <button 
                      onClick={() => setIsInviteModalOpen(true)}
                      className="w-8 h-8 rounded-full border border-dashed border-[#454545] flex items-center justify-center text-[#a2a0a2] hover:border-white hover:text-white transition-all hover:bg-[#2a2b2d]"
                    >
                       <Plus size={16} />
                    </button>
                 </div>
              </section>

              {/* Goals Section */}
              <section className="bg-[#1e1f21] border border-[#333538] rounded-xl p-5 flex flex-col space-y-5">
                 <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-bold text-white">Goals</h3>
                    <button className="px-2.5 py-1 border border-[#333538] rounded-md text-[11px] font-bold text-white hover:bg-[#333538] transition-colors shadow-sm">
                      Create goal
                    </button>
                 </div>
                 
                 <div className="space-y-4 py-2">
                    <p className="text-[13px] font-bold text-white leading-tight">This team hasn't created any goals yet</p>
                    <p className="text-[12px] text-[#a2a0a2] leading-relaxed opacity-80">Add a goal so the team can see what you hope to achieve.</p>
                 </div>

                 {/* Skeleton Goal Line */}
                 <div className="space-y-3 pt-4 border-t border-[#333538]/50">
                    <div className="h-2 w-3/4 bg-[#2a2b2d] rounded-full" />
                    <div className="h-1.5 w-full bg-[#2a2b2d] rounded-full relative overflow-hidden">
                       <div className="absolute inset-0 bg-[#4ade80]/20" />
                    </div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-[#a2a0a2] uppercase tracking-widest">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                       <span>On track (0%)</span>
                       <span className="ml-auto block w-4 h-4 rounded-full bg-[#2a2b2d]" />
                    </div>
                 </div>
              </section>
           </div>
        </div>
      </div>
      
      <TeamSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onUpdateTeam={handleUpdateDescription}
      />

      <AddWorkModal 
        isOpen={isAddWorkOpen}
        onClose={() => setIsAddWorkOpen(false)}
        onAddWork={handleAddWorkComplete}
        availableProjects={projects}
      />

      <InviteTeammatesModal 
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSend={handleInviteComplete}
        availableProjects={projects}
      />
    </div>
  );
};

// --- Helper Components ---

const SetupActionCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick?: () => void, isComplete?: boolean }> = ({ icon, title, description, onClick, isComplete }) => (
  <div 
    onClick={onClick}
    className={`bg-transparent border ${isComplete ? 'border-white/80' : 'border-[#333538]'} rounded-lg p-4 flex flex-col space-y-2 hover:bg-[#2a2b2d] cursor-pointer transition-all group active:scale-[0.99] min-h-[140px]`}
  >
    <div className={`w-8 h-8 rounded-lg ${isComplete ? 'bg-[#25e8ac]/10 border border-[#25e8ac]/20' : 'bg-[#333538] border border-white/5'} flex items-center justify-center mb-1 group-hover:bg-[#454545] transition-colors`}>
       {isComplete ? <CheckCircle size={18} className="text-[#25e8ac]" /> : icon}
    </div>
    <div className="space-y-1">
       <p className={`text-[13px] font-bold ${isComplete ? 'text-[#a2a0a2]' : 'text-white'} group-hover:underline tracking-tight`}>{title}</p>
       <p className={`text-[12px] ${isComplete ? 'text-[#a2a0a2]/60' : 'text-[#a2a0a2]'} leading-snug opacity-80`}>{description}</p>
    </div>
  </div>
);

const CuratedWorkItem: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <div className="flex items-center space-x-4 p-3 hover:bg-[#2e2e30]/30 rounded-lg group transition-colors cursor-default">
     <div className="w-9 h-9 rounded-md bg-[#2a2b2d] flex items-center justify-center shadow-inner border border-white/5">
        {icon}
     </div>
     <div className="flex-1 space-y-2">
        <div className="h-2.5 w-[200px] bg-[#2a2b2d] rounded-full animate-pulse" />
        <div className="h-2 w-[140px] bg-[#2a2b2d] rounded-full animate-pulse opacity-60" />
     </div>
  </div>
);

export default WorkspaceOverview;
