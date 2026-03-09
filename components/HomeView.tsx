import React from 'react';
import { 
  ChevronDown, MoreHorizontal, CheckCircle2, Lock, Plus, 
  LayoutGrid, Users, Rocket, Zap, Monitor, 
  BookOpen, ChevronRight, Circle, X
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface HomeViewProps {
  userName?: string;
}

const HomeView: React.FC<HomeViewProps> = () => {
  const { user } = useUser();

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar p-10 animate-in fade-in duration-500">
      <div className="max-w-[1200px] mx-auto w-full space-y-10 pb-20">
        
        {/* Header Section */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold text-white tracking-tight leading-tight">Good evening, {user.firstName}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-[12px] font-medium text-white">
              <span>My week</span>
              <ChevronDown size={14} />
            </button>
            <div className="flex items-center space-x-4 text-zinc-400 text-[11px] border-r border-zinc-800 pr-4">
               <div className="flex items-center space-x-1.5">
                  <CheckCircle2 size={16} className="text-zinc-500" />
                  <span className="font-bold text-white">0</span> <span className="opacity-80">tasks completed</span>
               </div>
               <div className="flex items-center space-x-1.5">
                  <Users size={16} className="text-zinc-500" />
                  <span className="font-bold text-white">0</span> <span className="opacity-80">collaborators</span>
               </div>
            </div>
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors text-[12px] font-medium text-white group">
              <LayoutGrid size={16} className="text-green-400" />
              <span>Customize</span>
            </button>
          </div>
        </div>

        {/* Top Widgets Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Widget A: My tasks */}
          <WidgetCard title="My tasks" icon={<Lock size={14} className="text-zinc-500" />} avatar={user.initials} avatarColor={user.avatarColor}>
            <WidgetTabs tabs={['Upcoming', 'Overdue', 'Completed']} activeTab="Upcoming" />
            <div className="p-4 flex flex-col space-y-1">
               <button className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors py-1.5 pl-1.5">
                  <Plus size={16} />
                  <span className="text-[13px]">Create task</span>
               </button>
               
               <TaskItem title="Draft project brief" project="Cross-functional project plan" color="#4ade80" date="Today – Feb 23" />
               <TaskItem title="Schedule kickoff meeting" project="Cross-functional project plan" color="#4ade80" date="Feb 20 – 24" />
            </div>
          </WidgetCard>

          {/* Widget B: Projects */}
          <WidgetCard title="Projects" subtitle="Recents">
            <div className="p-6 grid grid-cols-2 gap-4">
               {/* Create project card */}
               <div className="w-full aspect-square border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center hover:bg-zinc-800 cursor-pointer transition-all group">
                  <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center mb-2 shadow-sm group-hover:border-zinc-700">
                     <Plus size={20} className="text-zinc-400 group-hover:text-white" />
                  </div>
                  <span className="text-[12px] text-zinc-400 group-hover:text-white font-medium">Create project</span>
               </div>
               
               {/* Existing project card */}
               <div className="w-full aspect-square bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center group cursor-pointer hover:bg-zinc-800 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-green-400/10 border border-green-400/20 flex items-center justify-center mb-3 shadow-sm">
                     <LayoutGrid size={22} className="text-green-400" />
                  </div>
                  <span className="text-[13px] font-bold text-white text-center leading-tight mb-1">Cross-functional project pl...</span>
                  <span className="text-[11px] text-zinc-400 font-medium">3 tasks due soon</span>
               </div>
            </div>
          </WidgetCard>
        </div>

        {/* Widget C: Learn Asana (Full Width Row) */}
        <WidgetCard title="Learn Asana">
           <div className="p-6 relative group/carousel">
              <div className="flex space-x-4 overflow-x-hidden">
                 <LearningCard 
                    title="Getting started" 
                    sub="Learn the basics and see how Asana helps you get work done." 
                    badge="3 min" 
                    icon={<Rocket size={48} />} 
                 />
                 <LearningCard 
                    title="Automate work with rules" 
                    sub="Learn how to streamline work by automating tasks in Asana." 
                    badge="3 min" 
                    icon={<Zap size={48} />} 
                 />
                 <LearningCard 
                    title="Manage projects in Asana" 
                    sub="Plan, organize, and manage your projects effectively." 
                    badge="15 min" 
                    icon={<Monitor size={48} />} 
                 />
                 <LearningCard 
                    title="Avoid silos with projects" 
                    sub="Learn how to add work into projects for better visibility." 
                    badge="5 min read" 
                    icon={<LayoutGrid size={48} />} 
                 />
              </div>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white hover:bg-zinc-800 transition-all z-10 shadow-2xl scale-0 group-hover/carousel:scale-100 duration-200">
                 <ChevronRight size={20} />
              </button>
           </div>
        </WidgetCard>

        {/* Bottom Widgets Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Widget D: Tasks I've assigned */}
          <WidgetCard title="Tasks I've assigned">
             <WidgetTabs tabs={['Upcoming', 'Overdue', 'Completed']} activeTab="Upcoming" />
             <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[200px]">
                <div className="w-14 h-14 rounded-full border border-zinc-800 flex items-center justify-center mb-6">
                   <CheckCircle2 size={24} className="text-zinc-800" />
                </div>
                <p className="text-zinc-400 text-[13px] text-center mb-6 px-4">
                   Assign tasks to your colleagues, and keep track of them here.
                </p>
                <button className="px-5 py-1.5 bg-transparent border border-zinc-700 rounded-lg text-[13px] font-semibold text-white hover:bg-zinc-800 transition-colors">
                   Assign task
                </button>
             </div>
          </WidgetCard>

          {/* Widget E: Goals */}
          <WidgetCard title="Goals">
             <WidgetTabs tabs={['My goals', 'Team']} activeTab="Team" />
             <div className="p-6 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                   <div className="space-y-1">
                      <p className="text-white font-bold text-[13px]">You haven't added team goals yet.</p>
                      <p className="text-zinc-400 text-[12px] leading-relaxed max-w-[220px]">
                        Add a goal so your team knows what you plan to achieve.
                      </p>
                   </div>
                   <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-transparent border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors text-[13px] font-semibold text-white">
                      <Plus size={16} />
                      <span>Create goal</span>
                   </button>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 space-y-2">
                           <div className="h-2 w-[70%] bg-zinc-800 rounded-full" />
                           <div className="h-2 w-[40%] bg-zinc-800 rounded-full opacity-60" />
                        </div>
                        <div className="flex items-center space-x-3 w-36 justify-end">
                           <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-green-400 w-[90%]" />
                           </div>
                           <span className="text-[11px] text-zinc-400 font-bold min-w-[28px]">90%</span>
                        </div>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 space-y-2">
                           <div className="h-2 w-[85%] bg-zinc-800 rounded-full" />
                           <div className="h-2 w-[55%] bg-zinc-800 rounded-full opacity-60" />
                        </div>
                        <div className="flex items-center space-x-3 w-36 justify-end">
                           <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 w-[75%]" />
                           </div>
                           <span className="text-[11px] text-zinc-400 font-bold min-w-[28px]">75%</span>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </WidgetCard>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-2 gap-6">
           {/* Widget F: People */}
           <WidgetCard title="People" subtitle="Frequent collaborators">
              <div className="flex-1 flex flex-col items-center justify-center p-12 min-h-[220px]">
                 <div className="w-16 h-16 rounded-full bg-zinc-800/30 flex items-center justify-center mb-6">
                    <Users size={32} className="text-zinc-800" />
                 </div>
                 <p className="text-zinc-400 text-[13px] text-center mb-8 px-8 leading-relaxed">
                    Invite your teammates to collaborate in Asana
                 </p>
                 <button className="px-5 py-1.5 bg-transparent border border-zinc-700 rounded-lg text-[13px] font-semibold text-white hover:bg-zinc-800 transition-colors">
                    Invite teammates
                 </button>
              </div>
           </WidgetCard>

           {/* Widget G: Customize Placeholder */}
           <div className="bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-12 min-h-[220px] relative group">
              <button className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                 <X size={18} />
              </button>
              <h3 className="text-[18px] font-bold text-white mb-6">Drag and drop new widgets</h3>
              <button className="flex items-center space-x-2 px-5 py-1.5 bg-transparent border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors text-[14px] font-bold text-white">
                 <LayoutGrid size={16} className="text-green-400" />
                 <span>Customize</span>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

// --- Subcomponents ---

const WidgetCard: React.FC<{ 
  title: string; 
  icon?: React.ReactNode; 
  subtitle?: string; 
  avatar?: string;
  avatarColor?: string;
  children: React.ReactNode 
}> = ({ title, icon, subtitle, avatar, avatarColor, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-sm group">
    <div className="px-6 py-4 flex items-center justify-between border-b border-zinc-800/40">
      <div className="flex items-center space-x-2">
         {avatar && (
            <div className={`w-8 h-8 rounded-full ${avatarColor || 'bg-amber-500'} flex items-center justify-center text-[11px] font-bold text-white mr-2 shadow-sm`}>
               {avatar}
            </div>
         )}
         <h3 className="text-[14px] font-bold text-white tracking-tight leading-tight">{title}</h3>
         {icon && icon}
         {subtitle && (
            <div className="flex items-center space-x-1 ml-2 cursor-pointer hover:text-white transition-colors text-zinc-400">
               <span className="text-[11px] font-medium opacity-80">{subtitle}</span>
               <ChevronDown size={14} />
            </div>
         )}
      </div>
      <button className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors opacity-0 group-hover:opacity-100">
         <MoreHorizontal size={18} />
      </button>
    </div>
    <div className="flex-1 flex flex-col">
       {children}
    </div>
  </div>
);

const WidgetTabs: React.FC<{ tabs: string[]; activeTab: string }> = ({ tabs, activeTab }) => (
  <div className="px-6 flex items-center space-x-6 border-b border-zinc-800/20">
    {tabs.map((tab) => (
      <button
        key={tab}
        className={`py-3 text-[12px] font-bold transition-all relative ${
          activeTab === tab ? 'text-white' : 'text-zinc-400 hover:text-white'
        }`}
      >
        {tab}
        {activeTab === tab && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full" />
        )}
      </button>
    ))}
  </div>
);

const TaskItem: React.FC<{ title: string; project: string; color: string; date: string }> = ({ title, project, color, date }) => (
  <div className="flex items-center px-2 py-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors group">
    <Circle size={14} className="text-zinc-500 group-hover:text-white mr-3 flex-shrink-0" />
    <span className="text-[13px] text-white font-medium flex-1 truncate">{title}</span>
    <div className="flex items-center space-x-3 ml-4">
       <div className="bg-zinc-950 border border-zinc-800 rounded-full px-2 py-0.5 flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-zinc-400 max-w-[60px] truncate font-medium">{project}</span>
       </div>
       <span className="text-[10px] text-zinc-400 whitespace-nowrap opacity-80 font-medium">{date}</span>
    </div>
  </div>
);

const LearningCard: React.FC<{ 
  title: string; 
  sub: string; 
  badge: string; 
  icon: React.ReactNode 
}> = ({ title, sub, badge, icon }) => (
  <div className="w-[280px] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col flex-shrink-0 group cursor-pointer hover:border-zinc-700 transition-all">
     <div className="h-[130px] bg-rose-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-30" />
        <div className="text-white transform group-hover:scale-105 transition-transform duration-500">{icon}</div>
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/50 backdrop-blur-sm rounded-md text-[10px] font-bold text-white flex items-center space-x-1.5">
           <Rocket size={12} />
           <span>{badge}</span>
        </div>
     </div>
     <div className="p-5 flex flex-col h-[100px] justify-between">
        <div>
           <h4 className="text-[13px] font-bold text-white mb-1 leading-tight group-hover:underline">{title}</h4>
           <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2 opacity-90 font-medium">
              {sub}
           </p>
        </div>
     </div>
  </div>
);

export default HomeView;
