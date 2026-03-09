import React, { useState } from 'react';
import { 
  ChevronDown, ChevronLeft, Plus, Lock, Settings2, Info, ArrowRight, ArrowLeft,
  LayoutList, Calendar, LayoutDashboard, BarChart2, MessageSquare, MoreHorizontal, UserPlus, Sliders, Filter,
  ChevronRight, Star, CheckCircle
} from 'lucide-react';

interface PortfolioWorkspaceProps {
  portfolioName: string;
}

const PortfolioWorkspace: React.FC<PortfolioWorkspaceProps> = ({ portfolioName }) => {
  const tabs = ['List', 'Timeline', 'Dashboard', 'Progress', 'Workload', 'Messages'];
  const [activeTab, setActiveTab] = React.useState('Workload');
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  return (
    <div className="flex-1 flex bg-[#1e1f21] overflow-hidden animate-in fade-in duration-300 relative">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Workspace Header */}
        <div className="px-6 pt-5 pb-0 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
                <div className="w-5 h-4 bg-white/20 rounded-sm" />
              </div>
              <div className="flex items-center group/title relative">
                <h1 className="text-2xl font-bold flex items-center cursor-default tracking-tight">
                  {portfolioName}
                </h1>
                <Star size={18} className="ml-3 text-[#a2a0a2] hover:text-yellow-400 transition-colors cursor-pointer" />
              </div>
              <div className="flex items-center space-x-1.5 ml-4 bg-[#2a2b2d] px-2 py-1 rounded-full border border-[#333538] cursor-pointer hover:bg-[#333538] transition-colors">
                <div className="w-2 h-2 bg-[#a2a0a2] rounded-full" />
                <span className="text-[12px] text-white">Set status</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-1 mr-4">
                 <div className="w-7 h-7 rounded-full bg-pink-600 border-2 border-[#1e1f21] flex items-center justify-center text-[10px] font-bold">TT</div>
              </div>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] bg-[#4573d2] rounded-lg hover:bg-[#5a87e5] transition-colors font-medium shadow-sm">
                <UserPlus size={14} className="mr-1" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] border border-[#333538] rounded-lg hover:bg-[#333538] transition-colors">
                <Settings2 size={14} className="text-[#a2a0a2]" />
                <span>Customize</span>
              </button>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center space-x-6 border-b border-[#333538]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[14px] font-medium transition-all relative ${
                  activeTab === tab ? 'text-white' : 'text-[#a2a0a2] hover:text-white'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
                )}
              </button>
            ))}
            <button className="pb-3 text-[#a2a0a2] hover:text-white">
               <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-[#333538] flex items-center justify-between bg-[#1e1f21] z-10">
          <div className="flex items-center space-x-4">
             <button className="flex items-center space-x-1.5 px-3 py-1.5 text-[13px] border border-[#333538] rounded-lg hover:bg-[#333538] transition-colors font-medium">
                <Plus size={16} />
                <span>Add work</span>
             </button>
             <div className="flex items-center space-x-2 ml-4">
               <ChevronLeft size={18} className="text-[#a2a0a2] cursor-pointer hover:text-white transition-colors" />
               <span className="text-[13px] font-medium cursor-default">Today</span>
               <ChevronRight size={18} className="text-[#a2a0a2] cursor-pointer hover:text-white transition-colors" />
             </div>
          </div>

          <div className="flex items-center space-x-5 text-[#a2a0a2]">
            <span className="text-[12px] cursor-default">No date</span>
            <button className="flex items-center space-x-1.5 text-[12px] hover:text-white">
               <Calendar size={14} />
               <span>Days (small)</span>
            </button>
            <ToolbarAction icon={<Filter size={14} />} label="Filter" />
            <ToolbarAction icon={<CheckCircle size={14} />} label="Task count" />
            <ToolbarAction icon={<Sliders size={14} />} label="Options" />
            <button className="text-[12px] hover:underline">Send feedback</button>
          </div>
        </div>

        {/* Main Content: Workload Empty State */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center justify-center p-8">
           <div className="max-w-3xl w-full flex flex-col items-center">
              <div className="w-full max-w-lg mb-12 bg-[#2a2b2d]/20 border border-[#333538] rounded-xl p-8 relative shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center space-x-4 opacity-40">
                      <div className="w-6 h-6 rounded-full bg-[#333538] flex-shrink-0" />
                      <div className="h-2 w-32 bg-[#333538] rounded-full" />
                      <div className="flex-1 h-2 bg-[#333538]/30 rounded-full relative">
                        <div className="absolute top-0 h-full bg-[#4573d2]/40 rounded-full" style={{ left: `${i*10}%`, width: `${20 + i*5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <h2 className="text-[24px] font-bold text-white mb-3">Open a window into your team's workload</h2>
              <p className="text-[#a2a0a2] text-[15px] text-center leading-relaxed max-w-xl">
                It's easy. Just add projects to your portfolio. For the best overview, make sure projects include assigned tasks and dates. <span className="text-[#4573d2] hover:underline cursor-pointer">Learn more about workload</span>
              </p>
           </div>
        </div>
      </div>

      {/* Right Utility Panel */}
      <div 
        className={`
          bg-[#2a2b2d] border-l border-[#333538] flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out
          ${isRightSidebarOpen ? 'w-[300px]' : 'w-0 border-l-0 overflow-hidden'}
        `}
      >
        <div className="min-w-[300px] h-full flex flex-col">
          <div className="p-4 border-b border-[#333538] flex items-center justify-between">
             <h3 className="font-bold text-[14px] whitespace-nowrap">Tasks with no due dates</h3>
             <ArrowRight 
                size={18} 
                className="text-[#a2a0a2] cursor-pointer hover:text-white transition-colors" 
                onClick={() => setIsRightSidebarOpen(false)}
             />
          </div>
          <div className="flex-1 p-4 flex flex-col">
             <div className="flex items-start space-x-3 text-[#a2a0a2] mb-12 bg-[#333538]/30 p-3 rounded-lg border border-[#333538]">
                <Info size={18} className="mt-0.5 flex-shrink-0" />
                <p className="text-[12px] leading-relaxed">
                  To see subtasks, visit the project's list view.
                </p>
             </div>
             
             <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-[#333538] rounded-full flex items-center justify-center mb-6 shadow-inner">
                   <div className="w-8 h-2 bg-[#454545] rounded-full relative">
                     <div className="absolute -top-3 left-2 w-4 h-1 bg-[#454545] rounded-full" />
                     <div className="absolute -bottom-3 right-2 w-4 h-1 bg-[#454545] rounded-full" />
                   </div>
                </div>
                <p className="text-[15px] font-medium text-[#a2a0a2] whitespace-nowrap">You don't have any unscheduled tasks!</p>
             </div>
          </div>
        </div>
      </div>

      {/* Expansion Toggle (Vertical Bar) */}
      {!isRightSidebarOpen && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-2 hover:bg-[#333538] cursor-pointer flex items-center justify-center group transition-colors z-20"
          onClick={() => setIsRightSidebarOpen(true)}
        >
          <div className="bg-[#2a2b2d] border border-[#333538] rounded-l-lg p-1 text-[#a2a0a2] group-hover:text-white transition-all transform translate-x-1 group-hover:translate-x-0 absolute right-0 top-1/2 -translate-y-1/2">
             <ArrowLeft size={16} />
          </div>
        </div>
      )}
    </div>
  );
};

const ToolbarAction: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button className="flex items-center space-x-1.5 hover:bg-[#333538] px-2 py-1 rounded transition-colors group">
    <div className="text-[#a2a0a2] group-hover:text-white transition-colors">{icon}</div>
    <span className="text-[12px] group-hover:text-white font-medium transition-colors">{label}</span>
  </button>
);

export default PortfolioWorkspace;